var should = require('should');
var fec = require('../lib/fec');
var fs = require('fs');
var helpers = require('./helpers');

/**
 * Hamming(8,4)
 * the default encoder
 */
describe('Hamming(8,4) encoder', function() {
  var encoder = new fec.Encoder();

  it('should not require options', function() {
    encoder.should.be.ok;
  });

  it('should default to Hamming(8,4)', function() {
    encoder.method.should.equal(fec.methods.hamming84);
  });

  it('should work without any options', function(done) {
    fs.createReadStream(helpers.getFilePath('test.txt'))
      .pipe(encoder)
      .pipe(fs.createWriteStream(helpers.getFilePath('./test.1.out')))
      .on('finish', function() {
        done();
      });
  });

  it('should work for big files', function(done) {
    var enc = new fec.Encoder({method: fec.methods.hamming84});
    fs.createReadStream(helpers.getFilePath('popsci1900.txt'))
      .pipe(enc)
      .pipe(fs.createWriteStream(helpers.getFilePath('popsci1900.out')))
      .on('finish', function() {
        done();
      });
  });
});

describe('Hamming(8,4) decoder', function() {
  it('should work without any options for a file generated without any options', function(done) {
    var decoder = new fec.Decoder();
    decoder.should.be.ok;

    fs.createReadStream(helpers.getFilePath('./test.1.out'))
      .pipe(decoder)
      .pipe(fs.createWriteStream(helpers.getFilePath('./test.1.out.txt')))
      .on('finish', function() {
        helpers.testFilesEqual('test.txt', 'test.1.out.txt', done);
      });
  });

  it('should work for big files', function(done) {
    var decoder = new fec.Decoder({method: fec.methods.hamming84});
    decoder.should.be.ok;

    fs.createReadStream(helpers.getFilePath('popsci1900.out'))
      .pipe(decoder)
      .pipe(fs.createWriteStream(helpers.getFilePath('popsci1900.out.txt')))
      .on('finish', function() {
        helpers.testFilesEqual('popsci1900.txt', 'popsci1900.out.txt', done);
      });
  });
});
