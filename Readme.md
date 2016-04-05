# Forward Error Correction
A transform stream module for node.js.

## Motivation
Node is all about I/O, so this might help someone who was trying to do I/O over a crappy channel. I don't have any specific use for it at the moment.

## Usage
```
npm install fec-stream
```
```js
var fec = require('fec-stream');
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

from [http://science.nasa.gov/media/medialibrary/2011/04/13/NASA_Comm_Services_EV-2_TAGGED.pdf](http://science.nasa.gov/media/medialibrary/2011/04/13/NASA_Comm_Services_EV-2_TAGGED.pdf):

Most missions employ error detecting – error correcting codes to substantially improve
telemetry link performance. DSN users are reminded that their encoders should conform to the
CCSDS Telemetry Channel Coding Blue Book (CCSDS 231.0-B-1, September 2003.
Acceptable codes include: 1) Convolutional r = 1/2, k = 7 only; 2) Reed-Solomon 223/255 only;
3) concatenated Convolutional / Reed-Solomon and 4) Turbo codes with rates: 1/2, 1/3, 1/4, or
1/6, block sizes: 1784, 3568, 7136, and 8920. 
