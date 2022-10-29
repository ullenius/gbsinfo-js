# Read Game Boy Sound-files in the browser

* Read and parse gbs-file headers in the browser.
* Mimics output of the `gbsinfo` tool found in [gbsplay](https://www.github.com/mmitch/gbsplay).

> “Any application that *can* be written in JavaScript, *will* eventually be written in JavaScript.”
> - Atwood's law

## Features
* Vanilla JavaScript. No dependencies.
* UTF-8 support.

## How to use it

### Web version
1. [Open gbsinfo-js](https://ullenius.github.io/gbsinfo-js).
2. Select a `.gbs`-file using the GUI.

### Node version
Output results as JSON:

```bash
$ node gbsinfo.js [FILE]...
```

For pretty printed JSON:

```bash
$ node gbsinfo.js [FILE]... | jq
```
```json
{
  "identifier": "GBS",
  "version": 1,
  "songs": 14,
  "firstSong": 1,
  "loadAddress": 16368,
  "initAddress": 16368,
  "playAddress": 16387,
  "stackPointer": 57344,
  "title": "Blaster Master: Enemy Below",
  "author": "Akira Suda",
  "copyright": "2000 Sunsoft",
  "timing": "128.00Hz timer",
  "file": {
    "size": 112,
    "romSize": 16384,
    "banks": 1
  }
}
```
#### Differences from browser-version
* Only supports ASCII-format.
* Number fields are displayed as zero-padded hex-values in the web version.

## Requirements
* Browser with ES6-support.
* Node v12.x or later for running unit tests.

## Running tests
Run `node tests/decode.test.js`.

They are written using [jspunytest](https://www.github.com/ullenius/jspunytest) which is bundled inside `tests/punytest.js`.

## Licence
GPL-3.0-only.
See [COPYING](COPYING).

### Libraries
* Uses `jspunytest` (MIT licence) for testing.

## Se also
* [gbstag](https://www.github.com/ullenius/gbstag) - similar tool in Java.
* [jbstag](https://www.github.com/ullenius/jbstag) - GUI tagger made in Java.
* [gbs-lib](https://www.github.com/ullenius/gbs-lib) - gbs java library.
