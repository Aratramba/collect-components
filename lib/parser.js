'use strict';
/* global require, module */

var path = require('path');
var YAML = require('js-yaml');
var cheerio = require('cheerio');
var deepEqual = require('deep-equal');

var CAPTURE_ALL = 'all';
var CAPTURE_SECTION = 'section';


/**
 * Do a quick scan for keyword
 */

function scan(src, keyword) {
  return (src.indexOf(keyword) > -1);
}


/**
 * Check comment keyword
 */

function isComponentComment(src, keyword) {
  return (src.trim().substring(0, keyword.length) === keyword);
}


/**
 * Returns all components for the given code
 */

function getComponents(templateSrc, filename, options){
  var $ = cheerio.load('<div>' + templateSrc + '</div>');
  var components = [];

  var nodeIndex = 0;

  $('*').contents().map(function(index, $el) {
  
    if ($el.type === 'comment') {
      var src = $el.data.trim();

      // keyword check
      if(isComponentComment(src, options.keyword)){
        src = src.substring(options.keyword.length);
        var meta = YAML.safeLoad(src) || {};
        
        var nodes = getComponentHtml($, $el, $.html($($el).nextAll()), options.keyword, meta);
        var html = nodes.filter(function(node) { 
          return (node.trim() !== '');
        }).join('\n');

        var output = render(html, meta, options.block);

        var component = {
          meta: meta,
          file: filename,
          output: output
        };

        // push comment
        return components.push(component);
      }
    }
  }.bind(this));

  return components;
}


/**
 * Get html component
 */

function getComponentHtml($, $el, $siblings, keyword, meta) {

  var capture = meta.capture;

  // default to single node
  if (typeof capture === 'undefined') {
    capture = 1;
  }

  // capture fixed number of nodes
  if (Number.isInteger(capture) || typeof capture === 'undefined') {
    return captureNumber($, $siblings, capture);
  }

  // capture all
  if (capture === CAPTURE_ALL) {
    return captureAll($, $siblings);
  }

  // capture section
  if (capture === CAPTURE_SECTION) {
    return captureSection($, $el, keyword, meta);
  }
}


/**
 * Capture fixed number of nodes
 */

function captureNumber($, $siblings, capture) {
  var nodes = [];

  if (typeof capture === 'undefined') {
    capture = 1;
  }

  $($siblings).each(function(n, $node) {
    if (n < capture) {
      nodes.push($.html($node))
    }
  });

  return nodes;
}


/**
 * Capture all siblings
 */

function captureAll($, $siblings) {
  var nodes = [];

  $($siblings).each(function(n, $node) {
    nodes.push($.html($node))
  });

  return nodes;
}


/**
 * Capture section
 *
 * This should return all nodes between the 
 * start-component and the next one.
 * 
 * This one is a bit more complicated because
 * cheerio doesn't put comment nodes inside
 * nextUntil(), nextAll() etc. So we need to
 * get the elements parent nodes contents
 * (including comments) and scan to the point where
 * the capturing of the section should start.
 */

function captureSection($, $el, keyword, meta) {
  var nodes = [];

  var doCapture = false;

  $($el).parent().contents('*').each(function(i, $node) {

    // detect comments
    if ($node.type === 'comment') {

      // get its contents
      var src = $node.data.trim();

      // check if it's a component
      if(isComponentComment(src, keyword)){

        // remove @component keyword
        src = src.substring(keyword.length);

        // parse to json
        var obj = YAML.safeLoad(src);
        
        // check if it's the same object
        if (deepEqual(obj, meta)) {

          // start capture
          doCapture = true;

        // if it's not the same object
        } else {

          // stop capture
          doCapture = false;
        }
      }
    }

    // capturing mode
    if (doCapture) {

      // all tags
      if ($node.type === 'tag' || $node.type === 'style' || $node.type === 'script') {
        nodes.push($.html($node))
      }
    }
  });

  return nodes;
}


/**
 * get all examples from the meta object
 * either one or both of meta.example and meta.examples can be given
 */

function getExamples(meta){
  var examples = [];
  if(meta.example){
    examples = examples.concat(meta.example);
  }
  if(meta.examples){
    examples = examples.concat(meta.examples);
  }
  return examples;
}


/**
 * Render output
 */

function render(src, meta, block) {
  var newSrc = [src];

  getExamples(meta).forEach(function(example, i){
    if (i === 0) {
      newSrc = [];
    }
    var lines = example.split('\n');
    lines.forEach(function(line) {
      var regex = new RegExp(block, 'g');
      line = line.replace(regex, src.split('\n'));
      newSrc.push(line);
    });
  });

  return newSrc.join('\n')
}


module.exports = {
  scan: scan,
  getComponents: getComponents,
  render: render,
  getExamples: getExamples,
  captureNumber: captureNumber,
  captureAll: captureAll,
  captureSection: captureSection
};