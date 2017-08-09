# Frame Stream

[![npm][npm-image]][npm-url]  
[![npm version][npm-version-image]][npm-version-url]  
[![travis][travis-image]][travis-url]  
[![{{stability}}][stability-image]][stability-url]  

[npm-image]: https://nodei.co/npm/frame-stream.png
[npm-url]: https://www.npmjs.com/package/frame-stream
[npm-version-image]: https://badge.fury.io/js/frame-stream.png
[npm-version-url]: http://badge.fury.io/js/frame-stream
[travis-image]: https://secure.travis-ci.org/akiva/frame-stream.png
[travis-url]: https://travis-ci.org/akiva/frame-stream
[stability-image]: http://badges.github.io/stability-badges/dist/stable.svg
[stability-url]: http://github.com/badges/stability-badges

## Overview

Filter data frames from a stream of buffers by a head marker and 
optional tail—or trailing—marker, keeping these bytes intact in the
returned chunks. This is useful when splitting up a stream of data 
with embedded frames used by some  protocols (especially useful for 
variable length frame protocols), or even for extracting other data, 
such as JPEG images.

## Installation

```bash
npm install --save frame-stream
```

## Usage

```javascript
const frameStream = require('frame-stream')
const JSONStream = require('JSONStream')

process.stdin
  .pipe(frameStream())
  .pipe(JSONStream.stringify(false))
  .pipe(process.stdout)
```

## License

MIT, see [LICENSE](LICENSE) for details.
