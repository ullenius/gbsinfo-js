"use strict";

function readFile(input) {
    console.log(input);

    var file = input.files[0];
    console.log(file.name);

    var reader = new FileReader();
    reader.readAsArrayBuffer( file );

    reader.onload = function foo() {
        var wholeFile = reader.result;
        var header = wholeFile.slice(0, 0x70);

        console.log("byte length", header.byteLength);

        var identifier = readChar(header.slice(0,3));
        var version = readByte(header.slice(3,4));
        var songs = readByte(header.slice(4,5));
        var firstSong = readByte(header.slice(5,6));

        var loadAddress = readShort(header.slice(6,8));
        console.log(`load address: 0x${loadAddress.toString(16)}`);

        var initAddress = readShort(header.slice(8,10));
        console.log(`init address: 0x${initAddress.toString(16)}`);

        var playAddress = readShort(header.slice(10,12));
        console.log(`play address: 0x${playAddress.toString(16)}`);

        var stackPointer = readShort(header.slice(12,14));
        console.log(`stack pointer: 0x${stackPointer.toString(16)}`);

        var timerModulo = readByte(header.slice(14,15));
        var timerControl = readByte(header.slice(15,16));
        console.log("timerModulo", timerModulo, "timerControl", timerControl);

        var title = readChar(header.slice(16,16+32));
        var author = readChar(header.slice(48, 48+32));
        var copyright = readChar(header.slice(80, 80+32));

        var gbsHeader = {
            "Identifier" : identifier,
            "GBSVersion" : version,
            "Title" : title,
            "Author" : author,
            "Copyright" : copyright,
            "Load address" : loadAddress,
            "Init address" : initAddress,
            "Play address" : playAddress,
            "Stack pointer" : stackPointer,
            "Subsongs" : songs,
            "Default subsong" : firstSong
        };

        console.log(gbsHeader);
    };
}

function readChar(buffer) {
    var view = new Uint8Array(buffer);
    var text = "";
    for (var i = 0; i < view.length; i++) {
        var ch = String.fromCharCode( view[i] );
        if (ch == '\0') {
            break;
        }
        text = text + ch;
    }
    return text;
}

function readByte(buffer) {
    var view = new Uint8Array(buffer);
    return view[0];
}

function readShort(buffer) {
    var view = new Uint16Array(buffer);
    return view[0];
}
