var should = require('should');
var fs = require('fs');
var path = require('path');
var diff = require('diff');

/**
 * Helper function to return the absolute path of a file in the test dir
 * @param file
 */
var getFilePath = module.exports.getFilePath = function(file) {
  return path.join(__dirname, file);
};

/**
 * Helper function to test that files are equal
 */
module.exports.testFilesEqual = function(f1, f2, done) {
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
