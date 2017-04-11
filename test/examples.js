'use strict';

var test = require('tape');
var fs = require('fs');
var scraper = require('../index');
var parser = require('../lib/parser');


/**
 * Examples
 */

 test('Get examples', function(assert){

   var actual = parser.getExamples({ example: 'foo' });
   var expected = ['foo'];
   assert.deepEqual(actual, expected, 'should return an array of examples when given example object string');

   actual = parser.getExamples({ example: ['foo', 'faa'] });
   expected = ['foo', 'faa'];
   assert.deepEqual(actual, expected, 'should return an array of examples when given example object array');

   actual = parser.getExamples({ example: '' });
   expected = [];
   assert.deepEqual(actual, expected, 'should return an empty when given an empty examples string');

   actual = parser.getExamples({ examples: 'foo' });
   expected = ['foo'];
   assert.deepEqual(actual, expected, 'should return an array of examples when given examples object string');

   actual = parser.getExamples({ examples: ['foo', 'faa'] });
   expected = ['foo', 'faa'];
   assert.deepEqual(actual, expected, 'should return an array of examples when given examples object array');

   actual = parser.getExamples({ examples: '' });
   expected = [];
   assert.deepEqual(actual, expected, 'should return an empty when given an empty examples string');

   actual = parser.getExamples({ example: 'bar', examples: ['foo', 'faa'] });
   expected = ['bar', 'foo', 'faa'];
   assert.deepEqual(actual, expected, 'should return an array of examples when given examples object array and example string');

   actual = parser.getExamples({ example: '', examples: ['foo', 'faa'] });
   expected = ['foo', 'faa'];
   assert.deepEqual(actual, expected, 'should return an array of examples when given examples object array');

   actual = parser.getExamples({ example: [], examples: [] });
   expected = [];
   assert.deepEqual(actual, expected, 'should return an empty array of examples when given empty examples object array');

   assert.end();
 });