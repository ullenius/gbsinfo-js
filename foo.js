"use strict";

var process = require("process");
var fs = require("fs");

var args = process.argv;

var GBS_HEADER_LENGTH = 0x70;

console.log( args );

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
                console.log("bytes read:", bytes);

                readFile( [ buffer ];
            }

            fs.close(fd, function foo(err) {
                if (err) {
                console.error( err );
                }
            });
            console.log("File closed successfully");
        });
    });
}
