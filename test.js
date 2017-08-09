const test = require('tape')
const Readable = require('stream').Readable
const filterFrame = require('.')
const through = require('through2')

const lyrics = '♪Fiddly digits, itchy britches♪I love you all'
const lyricsExpected = ['♪Fiddly digits, itchy britches', '♪I love you all']

test('Frame start accepts a buffer', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame(Buffer.from('♪')))
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, lyricsExpected)
    t.end()
  })
  rs.push(lyrics)
  rs.push(null)
})

test('Frame start accepts a string', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame('♪'))
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, lyricsExpected)
    t.end()
  })
  rs.push(lyrics)
  rs.push(null)
})

test('Frame start accepts a string with encoding', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame('e299aa', 'hex'))
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, lyricsExpected)
    t.end()
  })
  rs.push(lyrics)
  rs.push(null)
})

test('Frame start defaults to null (0x00)', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame())
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, ['\u0000hi�', '\u0000bye�'])
    t.end()
  })
  rs.push('\u0000hi�\u0000bye�')
  rs.push(null)
})

test('Frame end accepts a buffer', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame('\u0000', Buffer('\xff', 'ascii')))
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, ['\x00�', '\x00bye�'])
    t.end()
  })
  rs.push(Buffer.from('\x00\xffhi\xff\x00bye\xff', 'ascii'))
  rs.push(null)
})

test('Frame end accepts a string', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame('\u0000', '�'))
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, ['\x00�', '\x00bye�'])
    t.end()
  })
  rs.push('\x00�hi�\x00bye�')
  rs.push(null)
})

test('Frame end accepts a string with encoding', function (t) {
  const rs = new Readable()
  const results = []
  let i = 0
  rs
    .pipe(filterFrame('00', 'ff', 'hex'))
    .pipe(through(function (chunk, enc, done) {
      i++
      results.push(chunk.toString())
      done()
    }))
  rs.on('end', function () {
    t.equal(i, 2)
    t.deepEqual(results, ['\x00�', '\x00bye�'])
    t.end()
  })
  rs.push(Buffer.from('00ff6869ff00627965ff', 'hex'))
  rs.push(null)
})
