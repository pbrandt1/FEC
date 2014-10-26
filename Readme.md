# Forward Error Correction
A transform stream module for node.js.

## Motivation
Node is all about I/O, so this might help someone who was trying to do I/O over a crappy channel. I don't have any specific use for it at the moment.

## Usage
```
npm install fec
```
```js
var fec = require('fec');
var encoder = new fec.Encoder({method: fec.methods.hamming84});
var decoder = new fec.Decoder({method: fec.methods.hamming84});
readableStream.pipe(encoder).pipe(decoder).pipe(writableStream);
```

The available methods at this time are:
* Hamming(8,4)


## Development
Run tests with mocha.

## Todo
Raptor coding.
