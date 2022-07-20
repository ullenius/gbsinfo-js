"use strict";

function readFile(input) {
    var file = input.files[0];

    file.arrayBuffer().then(function parseHeader(wholeFile) {
        var utf8 = document.getElementById("encoding").checked;
        var readChar = utf8 ? readUtf8 : readAscii;
        console.log("DEBUG utf8", utf8);
        var LITTLE_ENDIAN = true;

        var header = wholeFile.slice(0, 0x70);
        var view = new DataView(header);
        var timerModulo = view.getUint8(14); // unused
        var timerControl = view.getUint8(15);

        var gbsHeader = {
            identifier    : readChar(header.slice(0,3)), // unused
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
            timing        : interruptRate(timerControl)
        };
        setTextarea( gbsHeader ); 
    }
    ).catch( function handle(err) {
        console.error(err);
    });
}

function interruptRate(tac) { // timer modulo
    return (tac & 0x80) === 0 ? "59.7Hz VBlank" : undefined;
}

function setTextarea(tags) {
    var {
        version, title, author, copyright, loadAddress, initAddress,
        playAddress, stackPointer, songs, firstSong, timing } = tags || {};
        var textArea = document.getElementById("gbsHeader");
        textArea.value = `
GBSVersion:       ${version}
Title:            ${title}
Author:           ${author}
Copyright:        ${copyright}
Load address:     0x${loadAddress.toString(16)}
Init address:     0x${initAddress.toString(16)}
Play address:     0x${playAddress.toString(16)}
Stack pointer:    0x${stackPointer.toString(16)}
Subsongs:         ${songs}
Default subsong:  ${firstSong}
Timing:           ${timing}
`.trimStart();
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
// else, return length of string
function length(view) {
    var NULL = 0;
    var nullPos = view.indexOf(NULL);
    console.log("nullPos", nullPos);
    return ~nullPos ? nullPos : view.length;
}

// required for node unit tests
if (typeof window === "undefined") {
    module.exports = { readUtf8, readAscii };
}
