/**
 * {{aggregate}}
 *
 * https://github.com/helpers/aggregate
 * Copyright (c) 2013 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


'use strict';

// Node.js modules
var path  = require('path');

// node_modules
var grunt = require('grunt');
var glob  = require('globule');
var yfm   = require('assemble-yaml');
var _     = require('lodash');


module.exports.register = function(Handlebars, options) {

  // If the 'assemble.options' object exists, use it
  var assembleOpts = options.aggregate || {};

  Handlebars.registerHelper("aggregate", function (src, options, compare_fn) {

    // Default options
    options = _.defaults(options.hash, assembleOpts, {sep: '\n'});

    var content;
    compare_fn = (compare_fn || options.compare_fn || compareFn);
    var index = 0;

    return glob.find(src, options).map(function (path, options) {
      var context = yfm.extract(path, options).context;
      var content = yfm.extract(path, options).content;
      index += 1;
      return {
        index: index,
        path: path,
        context: processContext(grunt, context),
        content: content
      };
    }).sort(compare_fn).map(function (obj) {
      var template = Handlebars.compile(obj.content);
      return new Handlebars.SafeString(template(obj.context));
    }).join(options.sep);
  });
};

/**
 * Process templates using grunt config data and context
 */
var processContext = function(grunt, context) {
  grunt.config.data = _.defaults(context || {}, _.cloneDeep(grunt.config.data));
  return grunt.config.process(grunt.config.data);
};

/**
 * Accepts two objects (a, b),
 * @param  {Object} a
 * @param  {Object} b
 * @return {Number} returns 1 if (a >= b), otherwise -1
 */
var compareFn = function(a, b) {
  return a.index >= b.index ? 1 : -1;
};