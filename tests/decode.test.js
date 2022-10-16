"use strict";

var {
    fail, assert, assertEquals, assertStrictEquals, tests
} = require("./punytest.js");

var gbsinfo = require("../gbsinfo.js");

tests({
    "ascii decoding" : function shortLine() {
        var expected = "hello world";
        var buffer = Buffer.from(expected);
        var actual = gbsinfo.readAscii(buffer);

        assertEquals(expected, actual);
    },
    "utf-8 decoding" : function shortUtf8Text() {
        var expected = "cheers 🍺🍺🍺";
        var buffer = Buffer.from(expected);
        var actual = gbsinfo.readUtf8(buffer);

        assertEquals(expected, actual);
    },

    "calculate rom size" : function sizeOfRom() {
        var filesize = 1 << 15;
        var loadAddress = 0x0070;
        var expected = 1 << 15;

        var actual = gbsinfo.romSize( filesize, loadAddress );
        assertStrictEquals(expected, actual);
    },

    "bank size 3" : function sizeOfRom3banks() {
        var filesize = 0xC000;
        var expected = 1 << 16;

        var actual = gbsinfo.romSize( filesize );
        //assertStrictEquals(expected, actual);
    }

});
