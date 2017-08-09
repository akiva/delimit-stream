const Transform = require('stream').Transform || require('readable-stream').Transform

function FilterFrameStream(start, end, enc) {
  start = start !== undefined ? start : Buffer.from('\u0000')
  end = end || false
  if (!enc) {
    if (/(ascii|utf8|utf16le|ucs2|base64|latin1|binary|hex)/.test(end)) {
      enc = end
      end = false
    }
    else enc = 'utf8'
  }
  if (!(this instanceof FilterFrameStream))
    return new FilterFrameStream(start, end, enc)
  Transform.call(this, { objectMode: false })
  this.buf = Buffer.alloc(0)
  this.head = Buffer.isBuffer(start) ? start : Buffer.from(start, enc)
  this.tail = end === false
    ? false
    : Buffer.isBuffer(end) ? end : Buffer.from(end, enc)
}

FilterFrameStream.prototype = Object.create(Transform.prototype)

FilterFrameStream.prototype._transform = function transform (chunk, enc, done) {
  this.buf = Buffer.concat([this.buf, chunk])
  let start, end, eof
  while ((start = this.buf.indexOf(this.head)) > -1) {
    if (this.tail === false) {
      if ((end = this.buf.slice(start + this.head.length).indexOf(this.head)) > -1) {
        eof = end + this.head.length
      }
      else break
    }
    else {
      if ((end = this.buf.slice(start + this.head.length).indexOf(this.tail)) > -1) {
        eof = end + start + this.head.length + this.tail.length
      }
      else break
    }
    this.push(this.buf.slice(start, eof))
    this.buf = this.buf.slice(eof)
  }
  done()
}

FilterFrameStream.prototype._flush = function flush (done) {
  done(null, this.buf)
}

module.exports = FilterFrameStream
