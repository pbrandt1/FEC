/**
 * Hamming(8,4)
 * Encodes 4 bits into 8 bits.  This method is able to correct 1 bit error, but detect 2 bit errors.
 */

/**
 * I use a map instead of a matrix.  It makes encoding super fast, and decoding fast in the absence of errors.
 * @type {[]}
 */
var fourToEightMap = [];
fourToEightMap[0] = 0;
fourToEightMap[8] = parseInt('11100001', 2);
fourToEightMap[4] = parseInt('10011001', 2);
fourToEightMap[12] = parseInt('01111000', 2);
fourToEightMap[2] = parseInt('01010101', 2);
fourToEightMap[10] = parseInt('10110100', 2);
fourToEightMap[6] = parseInt('11001100', 2);
fourToEightMap[14] = parseInt('00101101', 2);
fourToEightMap[1] = parseInt('11010010', 2);
fourToEightMap[9] = parseInt('00110011', 2);
fourToEightMap[5] = parseInt('01001011', 2);
fourToEightMap[13] = parseInt('10101010', 2);
fourToEightMap[3] = parseInt('10000111', 2);
fourToEightMap[11] = parseInt('01100110', 2);
fourToEightMap[7] = parseInt('00011110', 2);
fourToEightMap[15] = parseInt('11111111', 2);

//var EightToFourMap =

/**
 * This is the _transform method for encoding a stream in Hamming(8,4).
 * Since this method doubles the size of the data, we call this.push(outBuffer) twice.
 * @param data
 * @param encoding
 * @param done
 */
var encode = function(data, encoding, done) {
  var inBuffer = Buffer.isBuffer(data) ? data : new Buffer(data, encoding);

  // encode the first half of the buffer.  this is the longer half if inBuffer.length is odd.
  // TODO handle floating point error in calculating inBuffer.length/2?  What if 4/2 = 2.00000001? then ceil = 3.
  //      i think those errors cancel out in this code, but it's something to be aware of.
  var outBuffer = new Buffer(2*Math.ceil(inBuffer.length/2));
  for (var i = 0, length = Math.ceil(inBuffer.length/2); i < length; i++) {
    outBuffer[2*i] = fourToEightMap[(inBuffer[i]&240) >> 4];
    outBuffer[2*i + 1] = fourToEightMap[inBuffer[i]&15];
  }
  this.push(outBuffer);

  // encode the second half of the buffer.  this is the shorter half if inBuffer.length is odd.
  outBuffer = new Buffer(2*Math.floor(inBuffer.length/2));
  for (var i = Math.ceil(inBuffer.length/2), initial = i, length = inBuffer.length; i < length; i++) {
    outBuffer[2*(i - initial)] = fourToEightMap[(inBuffer[i]&240) >> 4];
    outBuffer[2*(i - initial) + 1] = fourToEightMap[inBuffer[i]&15];
  }
  this.push(outBuffer);

  done();
};

/**
 * Helper function to sum the set bits in an octet
 * @param octet
 * @returns {number}
 */
var addBitsInOctet = function(octet) {
  var sum = 0;
  for (var i = 0; i < 8; i++) {
    sum += octet & 1;
    octet = octet >> 1;
  }
  return sum;
};

/**
 * Helper function to retrieve the original 4 bit sequence from the 8 bit code.
 * We find the code where the sum of (thisCode XOR originalCode) <= 1;
 * @param code the 8 bit hamming code
 * @returns {number} the 4 bit original sequence
 */
var getOriginalBitsFromCode = function(code) {
  for (var i = 0; i < 16; i++) {
    var b = code ^ fourToEightMap[i];
    if (addBitsInOctet(b) <= 1) {
      return i;
    }
  }

  // if we get here and there is no original code retrieved, we have detected an error
  throw new Error("Irrecoverable error detected in Hamming(8,4) code.  The encoded value was " + code);
};

/**
 * _transform method for decoding a stream of octet codes into the original data.
 * Only corrects for 1 bit error.
 * @param data
 * @param encoding
 * @param done
 */
var decode = function(data, encoding, done) {
  var inBuffer = Buffer.isBuffer(data) ? data : new Buffer(data, encoding);
  var outBuffer = new Buffer(Math.ceil(inBuffer.length/2));
  for (var i = 0; i < inBuffer.length; i = i+2) {
    var octet = getOriginalBitsFromCode(inBuffer[i]) << 4;
    octet = octet | getOriginalBitsFromCode(inBuffer[i+1]);
    outBuffer[i/2] = octet;
  }
  this.push(outBuffer);
  done();
};

module.exports = {
  encode: encode,
  decode: decode
};
