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
        var view = new DataView(header);

        console.log("byte length", header.byteLength);

        var identifier = readChar(header.slice(0,3));
        var version = view.getUint8(3);
        var songs = view.getUint8(4);
        var firstSong = view.getUint8(5);

        var loadAddress = view.getUint16(6);
        console.log(`load address: 0x${loadAddress.toString(16)}`);

        var initAddress = view.getUint16(8);
        console.log(`init address: 0x${initAddress.toString(16)}`);

        var playAddress = view.getUint16(10);
        console.log(`play address: 0x${playAddress.toString(16)}`);

        var stackPointer = view.getUint16(12);
        console.log(`stack pointer: 0x${stackPointer.toString(16)}`);

        var timerModulo = view.getUint8(14);
        var timerControl = view.getUint8(15);
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
