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
        console.log("load address:", loadAddress.toString(16));

      //  console.log(view[0]);
      //  console.log(view);

    };
}

function readChar(buffer) {
    var view = new Uint8Array(buffer);
    var text = "";
    for (var i = 0; i < view.length; i++) {
        var ch = String.fromCharCode( view[i] );
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
