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

      //  console.log( header );
        console.log("byte length", header.byteLength);

        var identifier = readChar(header.slice(0,3));
        console.log(identifier);

        var version = readByte(header.slice(3,4));
        console.log("version", version);

        var songs = readByte(header.slice(4,5));
        console.log("no of songs", songs);

        var firstSong = readByte(header.slice(5,6));
        console.log("first songs", firstSong);

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
        console.log("title", title);


      //  console.log(view[0]);
      //  console.log(view);

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
