var test = require('tape');
var httpServer = require('http-server/lib/http-server');
var scraper = require('../index');
var path = require('path');
var fs = require('fs');


/**
 * Test localhost
 */

test('scrape localhost', function(assert){
  assert.plan(1);

  var server = httpServer.createServer({ root: path.join(__dirname, '/fixtures/') });
  server.listen(8000);

  scraper({
    url: 'http://localhost:8000/',
    paths: ['examples.html', 'capture.html', 'yaml.html'],
    complete: function(results) {
      assert.equal(results.length, 30);
      server.close();
    }
  });
});


/**
 * Test file output against fixture output
 */

test('scrape localhost file output', function(assert){
  assert.plan(1);

  var server = httpServer.createServer({ root: path.join(__dirname, '/fixtures/') });
  server.listen(8000);

  scraper({
    url: 'http://localhost:8000/',
    paths: ['examples.html', 'capture.html', 'yaml.html'],
    output: 'test/tmp/components.json',
    complete: function(results) {
      var actual = fs.readFileSync('test/tmp/components.json', 'utf-8');
      var expected = fs.readFileSync('test/fixtures/components.json', 'utf-8');
      assert.deepEqual(JSON.parse(actual), JSON.parse(expected));
      server.close();
    }
  });
});


/**
 * Test stream output against fixture output
 */

test('scrape localhost stream output', function(assert){
  assert.plan(1);

  var server = httpServer.createServer({ root: path.join(__dirname, '/fixtures/') });
  server.listen(8000);

  scraper({
    url: 'http://localhost:8000/',
    paths: ['examples.html', 'capture.html', 'yaml.html'],
    complete: function(results) {
      var expected = fs.readFileSync('test/fixtures/components.json', 'utf-8');
      assert.deepEqual(results, JSON.parse(expected));
      server.close();
    }
  });
});


/**
 * Test live environment
 */

test('scrape live', function(assert){
  assert.plan(1);

  scraper({
    url: 'https://rawgit.com/EightMedia/collect-components/master/test/fixtures/',
    paths: ['examples.html', 'capture.html', 'yaml.html'],
    complete: function(results) {
      assert.equal(results.length, 30);
    }
  });
});