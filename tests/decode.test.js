"use strict";

var {
    fail, assert, assertEquals, assertStrictEquals, assertThrows, tests
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

    "rom size with 3 banks" : function sizeOfRom3banks() {
        var filesize = 0xC000;
        var loadAddress = 0x3E70
        var expected = 1 << 16;

        var actual = gbsinfo.romSize( filesize, loadAddress );
        assertStrictEquals(expected, actual);
    },
    "bank size simple" : function bankSize2() {
        var filesize = 1 << 15;
        var romsize = 0x8000;

        var expected = 2;
        var actual = gbsinfo.banks( romsize );

        assertStrictEquals(expected, actual);
    },
    "bank size 3" : function bankSize3() {
        var romsize = 1 << 16;
        var expected = 4;
        var actual = gbsinfo.banks( romsize );

        assertStrictEquals(expected, actual);
    },
    "timer formatting" : function timerFormatting() {
        var expected = "3.14Hz timer";
        var actual = gbsinfo.formatTimer( Math.PI );

        assertEquals(expected, actual);
    },

    "length of binary-view test" : function viewLength() {
        var view = new Uint8Array( [ 1, 42, 777, 255, 0, 0, 0 ] );
        var expected = 4;

        var actual = gbsinfo.length( view );
        assertEquals(expected, actual);
    },

    "TAC to cycles test" : function cyclesTest() {
        var arr = dataprovider();
        arr.forEach( assertTacCycles );
    },

    "TAC to cycles game boy color" : function cyclesTestGbc() {
        var arr = dataproviderGbc();
        arr.forEach( assertTacCycles );
    },

    "interrupt rate VBlank" : function vblank() {
        var tac = 0;
        var tma = 0;

        var expected = "59.7Hz VBlank";
        var actual = gbsinfo.interruptRate( { tac, tma } );
        assertEquals(expected, actual);
    },

    "interrupt rate other GBC" : function interruptRateCustomGbc() {
        var tac = 4 | 1 << 7; // timer + GBC-bit
        var tma = 192;

        var expected = "128.00Hz timer";
        var actual = gbsinfo.interruptRate( { tac, tma } );
        assertEquals(expected, actual);
    },

    "interrupt rate other GB" : function interruptRateCustom() {
        var tac = 4; // use timer
        var tma = 192;

        var expected = "64.00Hz timer";
        var actual = gbsinfo.interruptRate( { tac, tma } );
        assertEquals(expected, actual);
    },

    "interrupt rate ugetab ignores GBC mode" : function ugetabGbc() {
        var tac = 196;
        var tma = 0;

        var expected = "16.00Hz timer + VBlank (ugetab)";
        var actual = gbsinfo.interruptRate( { tac, tma } );
        assertEquals(expected, actual);
    },

    "interrupt rate ugetab" : function ugetab() {
        var bitmask = ~0x80; // clear GBC-mode bit
        var tac = 196 & bitmask;
        var tma = 0;

        var expected = "16.00Hz timer + VBlank (ugetab)";
        var actual = gbsinfo.interruptRate( { tac, tma } );
        assertEquals(expected, actual);
    },

    "unknown interrupt rate fails" : function unknownInterruptrate() {
        var tac = 0x80;
        var tma = 0;
        var err = assertThrows(Error, function shouldThrow() {
            gbsinfo.interruptRate( { tac, tma } );
        });
        assertEquals("Unknown interrupt rate", err.message);
    }

});

function dataprovider() {
    return [
        { "tac" : 0, "expected" : 1 << 10 },
        { "tac" : 1, "expected" : 1 << 4 },
        { "tac" : 2, "expected" : 1 << 6 },
        { "tac" : 3, "expected" : 1 << 8 }
    ];
}

function dataproviderGbc() {
    return dataprovider().map( function gbc( element) {
        return { 
            "tac" : element.tac | 0x80, 
            "expected" : element.expected / 2
        };
    });
}

function assertTacCycles( { tac, expected } ) {
    var actual = gbsinfo.tacToCycles( tac );
    assertEquals(expected, actual);
}
