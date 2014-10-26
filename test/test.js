var should = require('should');
var fec = require('../lib/fec');
var fs = require('fs');
var path = require('path');
var diff = require('diff');

/**
 * Helper function to return the absolute path of a file in the test dir
 * @param file
 */
var getFilePath = function(file) {
  return path.join(__dirname, file);
};

/**
 * Helper function to test that files are equal
 */
var testFilesEqual = function(f1, f2, done) {
  fs.readFile(getFilePath(f1), function(err, original) {
    should(err).not.be.ok;
    fs.readFile(getFilePath(f2), function(err, recovered) {
      should(err).not.be.ok;
      var d = diff.diffChars(original.toString(), recovered.toString());
      d.length.should.equal(1);
      should(d[0].added).not.be.ok;
      done();
    });
  });
};

describe('fec', function() {
  it('should have a version number', function() {
    fec.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should have a listing of methods', function() {
    fec.should.have.property('methods');
  });
});

describe('fec.Encoder() -- Hamming(8,4)', function() {
  var encoder = new fec.Encoder();

  it('should not require options', function() {
    encoder.should.be.ok;
  });

  it('should default to Hamming(8,4)', function() {
    encoder.method.should.equal(fec.methods.hamming84);
  });

  it('should work without any options', function(done) {
    fs.createReadStream(getFilePath('test.txt'))
      .pipe(encoder)
      .pipe(fs.createWriteStream(getFilePath('./test.1.out')))
      .on('finish', function() {
        done();
      });
  });

  it('should work for big files', function(done) {
    var enc = new fec.Encoder({method: fec.methods.hamming84});
    fs.createReadStream(getFilePath('popsci1900.txt'))
      .pipe(enc)
      .pipe(fs.createWriteStream(getFilePath('popsci1900.out')))
      .on('finish', function() {
        done();
      });
  });
});

describe('fec.Decoder() -- Hamming(8,4)', function() {
  it('should work without any options for a file generated without any options', function(done) {
    var decoder = new fec.Decoder();
    decoder.should.be.ok;

    fs.createReadStream(getFilePath('./test.1.out'))
      .pipe(decoder)
      .pipe(fs.createWriteStream(getFilePath('./test.1.out.txt')))
      .on('finish', function() {
        testFilesEqual('test.txt', 'test.1.out.txt', done);
      });
  });

  it('should work for big files', function(done) {
    var decoder = new fec.Decoder({method: fec.methods.hamming84});
    decoder.should.be.ok;

    fs.createReadStream(getFilePath('popsci1900.out'))
      .pipe(decoder)
      .pipe(fs.createWriteStream(getFilePath('popsci1900.out.txt')))
      .on('finish', function() {
        testFilesEqual('popsci1900.txt', 'popsci1900.out.txt', done);
      });
  });
});
