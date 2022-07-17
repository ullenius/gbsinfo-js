# Read Game Boy Sound-files in the browser

* Read and parse gbs-file headers in the browser.
* Mimics output of the `gbsinfo` tool found in [gbsplay](https://www.github.com/mmitch/gbsplay).

> “Any application that *can* be written in JavaScript, *will* eventually be written in JavaScript.”
> - Atwood's law

## Features
* Vanilla JavaScript. No dependencies.
* UTF-8 support.

## How to use it
1. [Open gbsinfo-js](https://ullenius.github.io/gbsinfo-js).
2. Select a `.gbs`-file using the GUI.

## Requirements
* Browser with ES6-support.
* Node v8.x or later for running unit tests.

## Running tests
Run `node tests/decode.test.js`.

They are written using [jspunytest](https://www.github.com/ullenius/jspunytest) which is bundled inside `tests/punytest.js`.

## Licence
GPL 3 only.
See [COPYING](COPYING).

### Libraries
* Uses `jspunytest` (MIT licence) for testing.

## Se also
* [gbstag](https://www.github.com/ullenius/gbstag) - similar tool in Java.
* [jbstag](https://www.github.com/ullenius/jbstag) - GUI tagger made in Java.
* [gbs-lib](https://www.github.com/ullenius/gbs-lib) - gbs java library.