'use strict';

var test = require('tape');
var fs = require('fs');
var scraper = require('../index');
var parser = require('../lib/parser');


/**
 * Capture
 */

test('capture', function(assert){
  var src = fs.readFileSync('./test/fixtures/capture.html').toString();

  var components = parser.getComponents(src, 'test.pug', { keyword: '@component'});

  var actual = components[0].output;
  var expected = '<div>1</div>\n<div>2</div>\n<div>3</div>\n<div>4</div>\n<div>5</div>\n<div>6</div>';
  assert.equal(actual, expected);

  actual = components[1].output;
  expected = '<div>6</div>';
  assert.equal(actual, expected);

  actual = components[2].output;
  expected = '<div>1</div>\n<div>2</div>\n<div>3</div>';
  assert.equal(actual, expected);

  actual = components[3].output;
  expected = '';
  assert.equal(actual, expected);

  actual = components[4].output;
  expected = '';
  assert.equal(actual, expected);

  actual = components[5].output;
  expected = '<div>4</div>\n<div>5</div>\n<div>6</div>';
  assert.equal(actual, expected);

  actual = components[6].output;
  expected = '<div>7</div>';
  assert.equal(actual, expected);

  actual = components[7].output;
  expected = '<div>1</div>\n<div>2</div>\n<div>3</div>\n<div>4<div>4b</div></div>\n<div>5<div>5b</div></div>';
  assert.equal(actual, expected);

  assert.end();
});