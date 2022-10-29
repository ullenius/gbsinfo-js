"use strict";
/*
 * This file is part of gbsinfo
 *
 * gbsinfo is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 3.
 *
 * gbsinfo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * ----------------------------
 * gbsplay is a Gameboy sound player
 *
 * (C) 2003-2021 by Tobias Diedrich <ranma+gbsplay@tdiedrich.de>
 *                 Christian Garbs <mitch@cgarbs.de>
 *                 Maximilian Rehkopf <otakon@gmx.net>
 *                 Vegard Nossum <vegardno@ifi.uio.no>
 * ----------------------------
 *
 * The following code is a derivative work of the code from the gbsplay project,
 * which is licensed GPLv3.
 *
 * This code therefore is licensed under the terms of the
 * GNU Public License, version 3.
 *
 * GPL-3.0-only
*/
const GBHW_CLOCK = 1 << 22;
const DEBUG = false;
const log = { "debug" : function print( ...message ) {
        if (DEBUG) {
            console.log("debug - ", message);
        }
    }
};

if ( isNode() ) {
    var process = require("process");
    var fs = require("fs");
    var args = process.argv;

    var GBS_HEADER_LENGTH = 0x70;

    log.debug( args );
    var file = args[ 2 ];

    if (file) {
        fs.open( file, "r", function(status, fd) {
            if (status) {
                console.error( status.message );
                return;
            }
            var buffer = Buffer.alloc( GBS_HEADER_LENGTH );
            fs.read(fd, buffer, 0, GBS_HEADER_LENGTH, 0, function read(err, bytes, buffer) {
                if (err) {
                    console.error( err );
                }
                if (bytes > 0) {
                    log.debug("bytes read:", bytes);
                    buffer.arrayBuffer = function foo() {
                        return Promise.resolve(buffer.buffer);
                    };
                    readFile( { "files" : [ buffer ] } );
                }

                fs.close(fd, function foo(err) {
                    if (err) {
                    console.error( err );
                    }
                });
                log.debug("File closed successfully");
            });
        });
    }
}

function readFile(input) {
    var file = input.files[0];
    var utf8 = isNode() ? false : document.getElementById("encoding").checked

    file.arrayBuffer().then(function parseHeader(wholeFile) {
        var readChar = utf8 ? readUtf8 : readAscii;
        log.debug("utf8", utf8);
        var LITTLE_ENDIAN = true;

        var fileSize = wholeFile.byteLength;
        var header = wholeFile.slice(0, 0x70);
        var view = new DataView(header);
        var timerModulo = view.getUint8(14);
        var timerControl = view.getUint8(15);

        log.debug("tac:", timerControl);
        log.debug("tma:", timerModulo);

        var gbsHeader = {
            identifier    : readChar(header.slice(0,3)),
            version       : view.getUint8(3),
            songs         : view.getUint8(4),
            firstSong     : view.getUint8(5),
            loadAddress   : view.getUint16(6,  LITTLE_ENDIAN),
            initAddress   : view.getUint16(8,  LITTLE_ENDIAN),
            playAddress   : view.getUint16(10, LITTLE_ENDIAN),
            stackPointer  : view.getUint16(12, LITTLE_ENDIAN),
            title         : readChar(header.slice(16, 16+32)),
            author        : readChar(header.slice(48, 48+32)),
            copyright     : readChar(header.slice(80, 80+32)),
            timing        : interruptRate(
                { 
                    tac: timerControl,
                    tma: timerModulo
                })
        };
        gbsHeader.file = {
            size: fileSize, 
            romSize : romSize(fileSize, gbsHeader.loadAddress),
        }
        gbsHeader.file.banks = banks( gbsHeader.file.romSize );

        if (!validIdentifier( gbsHeader.identifier )) {
            var error = `Not a GBS-File: ${file.name}`;
        }

        if ( isNode() ) {
            console.log( JSON.stringify( gbsHeader ) );
        }
        else {
            setTextarea( gbsHeader, error ); // browser
        }
    }
    ).catch( function handle(err) {
        console.error(err);
    });
}

function validIdentifier( identifier ) {
    return identifier === "GBS";
}

function romSize( fileSizeInBytes, loadAddress ) {
    var romsize = codelen + 0x4000;
    var HDR_LEN_GBS = 0x70;
    var codelen = fileSizeInBytes - HDR_LEN_GBS;
    var magic = 0x3FFF;

    var size = (codelen + loadAddress + magic) & ~magic;
    return size;
}

function banks( romSizeBytes ) {
    var MAX_ROM_SIZE = 1 << 14; // 4 megabit (4 mebibytes)
    return romSizeBytes / MAX_ROM_SIZE;
}

function interruptRate( { tac, tma } ) {
    if (tac & 0x04) {
        var result = gbhwCalcTimerHz(tac, tma);

        var ugetab = (tac & 0x78) === 0x40;
        var val = formatTimer( result );
        return ugetab ? `${val} + VBlank (ugetab)` : val;
    }
    else if ( (tac & 0x80) === 0) {
       return "59.7Hz VBlank";
   }
   else {
       throw new Error("Unknown interrupt rate");
   }
}

function formatTimer( result ) {
    return `${result.toFixed(2)}Hz timer`;
}

function gbhwCalcTimerHz(tac, tma) {
    var timertc = tacToCycles( tac );
    return GBHW_CLOCK / timertc / (256 - tma);
}

function tacToCycles( tac ) {
    var lookup = [
        GBHW_CLOCK / 4096,    /* 1024 CPU cycles per TIMA tick */
        GBHW_CLOCK / 262144,  /*   16 CPU cycles per TIMA tick */
        GBHW_CLOCK / 65536,   /*   64 CPU cycles per TIMA tick */
        GBHW_CLOCK / 16384,   /*  256 CPU cycles per TIMA tick */
    ];
    var timertc = lookup[ tac & 3 ];
    return (tac & 0xF0) == 0x80 ? timertc / 2 : timertc; // emulate GBC mode
}

function setTextarea(tags, err) {
    var textArea = document.getElementById("gbsHeader");
    if (err) {
        textArea.value = err;
    }
    else {
        var {
            version, title, author, copyright, loadAddress, initAddress,
            playAddress, stackPointer, file, songs, firstSong, timing } = tags || {};
            var fileSize = file.size.toString(16).padStart(8, 0);
            var paddedRomSize = file.romSize.toString(16).padStart(8, 0);

            textArea.value = `
GBSVersion:       ${version}
Title:            ${title}
Author:           ${author}
Copyright:        ${copyright}
Load address:     0x${loadAddress.toString(16).padStart(4, 0)}
Init address:     0x${initAddress.toString(16).padStart(4, 0)}
Play address:     0x${playAddress.toString(16)}
Stack pointer:    0x${stackPointer.toString(16)}
File size:        0x${fileSize}
ROM size:         0x${paddedRomSize} (${file.banks} banks)
Subsongs:         ${songs}
Default subsong:  ${firstSong}
Timing:           ${timing}
`.trimStart();
    }
}

function readAscii(buffer) {
    var view = new Uint8Array(buffer);
    var len = length(view);
    var text = "";
    for (var i = 0; i < len; i++) {
        var ch = String.fromCharCode( view[i] );
        text = text + ch;
    }
    return text;
}

function readUtf8(buffer) {
    var decoder = new TextDecoder("utf-8");
    var view = new Uint8Array(buffer);
    var nullOffset = length(view);
    return decoder.decode(view.slice(0, nullOffset));
}

// returns offset for NULL-character if found
// else, return length
function length(view) {
    var NULL = 0;
    var nullPos = view.indexOf(NULL);
    return ~nullPos ? nullPos : view.length;
}

function isNode() {
    return typeof window === "undefined";
}

// required for node unit tests
if (isNode() ) {
    module.exports = { 
        readUtf8, readAscii, romSize, banks, formatTimer, length, tacToCycles,
        interruptRate, validIdentifier
    };
}
