var should = require('should');
var fec = require('../lib/fec');
var fs = require('fs');
var helpers = require('./helpers');

describe('RaptorQ encoder', function() {
  var encoder = new fec.Encoder({method: fec.methods.raptorQ});

  it('should work with the option method specified', function(done) {
    fs.createReadStream(helpers.getFilePath('test.txt'))
      .pipe(encoder)
      .pipe(fs.createWriteStream(helpers.getFilePath('./test.1.out')))
      .on('finish', function() {
        done();
      });
  });

  it('should work for big files', function(done) {
    var enc = new fec.Encoder({method: fec.methods.raptorQ});
    fs.createReadStream(helpers.getFilePath('popsci1900.txt'))
      .pipe(enc)
      .pipe(fs.createWriteStream(helpers.getFilePath('popsci1900.out')))
      .on('finish', function() {
        done();
      });
  });
});

describe('RaptorQ decoder', function() {
  it('should work for a file generated with raptorQ', function(done) {
    var decoder = new fec.Decoder({method: fec.methods.raptorQ});
    decoder.should.be.ok;

    fs.createReadStream(helpers.getFilePath('./test.1.out'))
      .pipe(decoder)
      .pipe(fs.createWriteStream(helpers.getFilePath('./test.1.out.txt')))
      .on('finish', function() {
        helpers.testFilesEqual('test.txt', 'test.1.out.txt', done);
      });
  });

  it('should work for big files', function(done) {
    var decoder = new fec.Decoder({method: fec.methods.raptorQ});
    decoder.should.be.ok;

    fs.createReadStream(helpers.getFilePath('popsci1900.out'))
      .pipe(decoder)
      .pipe(fs.createWriteStream(helpers.getFilePath('popsci1900.out.txt')))
      .on('finish', function() {
        helpers.testFilesEqual('popsci1900.txt', 'popsci1900.out.txt', done);
      });
  });
});
