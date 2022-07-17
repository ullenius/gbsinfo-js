# gbsinfo - Read Game Boy Sound-files in the browser (GBS)

* Read and parse gbs-files in the browser.
Mimics output of the `gbsinfo` tool found in [gbsplay](https://www.github.com/mmitch/gbsplay).

## Features
* Vanilla JavaScript. No dependencies.
* UTF-8 support.

## How to use it
Select a `.gbs`-file using the GUI.

## Requirements
* Browser with ES6-support.
* Node v8.x or later for running unit tests.

## Running tests
Run `node tests/decode.test.js`.

They are written using my fork of [jspunytest](https://www.github.com/ullenius/jspunytest) which is bundled inside `tests/punytest.js`.

## Licence
GPL 3 only.
See [COPYING](COPYING).

### Libraries
* Uses `jstinytest` (MIT licence) for testing.

## Se also
* [gbstag](https://www.github.com/ullenius/gbstag) - similar tool in Java.
* [jbstag](https://www.github.com/ullenius/jbstag) - GUI tagger made in Java.
* [gbs-lib](https://www.github.com/ullenius/gbs-lib) - gbs java library.