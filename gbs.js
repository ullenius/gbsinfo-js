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
