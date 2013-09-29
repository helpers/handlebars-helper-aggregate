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
  var assembleOptions = options || {};

  Handlebars.registerHelper("aggregate", function (src, options, compare_fn) {

    // Default options
    options = _.extend({}, {
      fromFile: true,
      sep: '\n'
    }, assembleOptions.aggregate, options.hash);

    var content;
    compare_fn = (compare_fn || options.compare_fn || compareFn);
    var index = 0;

    return glob.find(src, options).map(function (path, options) {
      index += 1;
      return {
        index: index,
        path: path,
        context: yfm.extract(path, options).context,
        content: yfm.extract(path, options).content
      };
    }).sort(compare_fn).map(function (obj) {
      obj.context = processContext(grunt, obj.context);
      var template = Handlebars.compile(obj.content);
      return new Handlebars.SafeString(template(obj.context));
    }).join(options.sep);
  });

};

/**
 * Process templates using grunt config data and context
 */
var processContext = function(grunt, context) {
  var config = _.cloneDeep(grunt.config.data);
  grunt.config.data = grunt.util._.defaults(context || {}, config);
  context = grunt.config.process(context);
  grunt.config.data = _.cloneDeep(config);
  return context;
};

/**
 * Accepts two objects (a, b),
 * @param  {Object} a
 * @param  {Object} b
 * @return {Number} returns 1 if (a >= b), otherwise -1
 */
var compareFn = function(a, b) {
  return a.index >= b.index ? 1 : -1;
}






