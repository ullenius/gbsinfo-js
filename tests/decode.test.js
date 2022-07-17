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
    }
});
