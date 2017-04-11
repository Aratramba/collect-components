'use strict';
/* globals require, module */

var fs = require('fs');
var http = require('http');
var path = require('path');
var mkdirp = require('mkdirp');
var through2 = require('through2');
var assign = require('object-assign');
var parser = require('./lib/parser.js');


/**
 * Design Manual components scraper
 * returns a JSON stream
 * optionally writes a JSON array containing
 * all docs to an output file.
 */

function scraper(options){

  if(typeof options === 'undefined'){
    throw new Error('Design Manual Scraper requires a settings object.');
  }

  if(typeof options.hostname === 'undefined'){
    throw new Error('Design Manual Scraper requires settings.hostname to be set.');
  }

  if(typeof options.paths === 'undefined'){
    throw new Error('Design Manual Scraper requires settings.paths to be set.');
  }

  // options
  options = assign({
    hostname: null,
    port: 80,
    protocol: 'http:',
    paths: [],
    keyword: '@component',
    block: '{{block}}',
    output: null,
    complete: function() {}
  }, options);

  var httpOptions = {
    host: options.url,
    port: options.port
  };

  var counter = 0;

  // register files
  var register = {};

  
  function getHTML(i) {

    // complete
    if (i === options.paths.length) {
      init();
      return;
    }

    // get url
    http.get(assign(httpOptions, { path: options.paths[i] }), function(res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {

        // quick check for keyword
        if (parser.scan(data, options.keyword)) {
          register[options.paths[i]] = data;
        }
        getHTML(++i);
      });
    }).on('error', function(e) {
      console.log(e.message);
      getHTML(++i);
    });
  }

  getHTML(0);


  // create readable stream
  var stream = through2({ objectMode: true },
    function(chunk, enc, next){
      this.push(chunk);
      next();
    },
    function(cb){
      cb();
    }
  );

  return;
  var output;


  /**
   * Init
   */

  function init(){

    // write stream to output file
    if(options.output){

      // create directory if it doesn't exist
      mkdirp.sync(path.dirname(options.output));

      // create writable stream
      output = fs.createWriteStream(options.output);
      output.write('[');

      output.on('close', function(){
        stream.emit('complete');
      });

      output.on('finish', function() {
        if (options.complete && typeof options.complete === 'function') {
          options.complete();
        }
      });
    }

    // get all files
    var file;

    // collect docs for all files
    for(file in register){
      var docs = parser.getComponents(register[file], file, options);

      docs.forEach(function(docItem) {
        // omit first comma
        if(counter !== 0 && options.output){
          output.write(',');
        }
        // add object to stream
        stream.push(docItem);
        if(options.output){
          // send to output
          output.write(JSON.stringify(docItem));
        }
        // up counter
        ++counter;
      });
    }

    // end json array stream
    if(options.output){
      output.write(']');
      output.end();
    } else {
      if (options.complete && typeof options.complete === 'function') {
        options.complete();
      }
    }

    // end stream
    stream.push(null);
  }

  return stream;

}

module.exports = scraper;

scraper({
  hostname: 'localhost',
  protocol: 'http:',
  port:  8000,
  paths: ['examples.html'],
  output: 'test/tmp/components.json'
});