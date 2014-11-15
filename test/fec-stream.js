var should = require('should');
var fec = require('../lib/fec');

describe('fec', function() {
  it('should have a version number', function() {
    fec.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  it('should have a listing of methods', function() {
    fec.should.have.property('methods');
  });
});
