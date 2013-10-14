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


  // collect, grab, combine, unite, unify, inline, concat, concatenate,

/**
 * {{aggregate}} helper
 * Accepts compare function as 3rd parameter. The function will be passed
 * two objects and is expected to return 1 if a >= b or -1 otherwise. IF
 * you want descending compare order, then 1 and -1 should be reversed.
 *
 * Optionally, a compare function can be defined in options passed to assemble:
 *   assemble: {
 *     options: {
 *       aggregate: {
 *         compare_fn: function(a, b) {return a.index >= b.index ? 1 : -1}
 *       }
 *     }
 *   }
 */
module.exports.register = function(Handlebars, options) {

  // If the 'assemble.options' object exists, use it
  var assembleOpts = options || {};

  /**
    * @param {String|Array} src          Globbing pattern(s).
    * @param {Function}     compare_fn   Function accepting two objects (a,b) and
    *                                    returning 1 if a >= b otherwise -1.
    *                                    
    * Note: properties passed to compare_fn are:
    *   {
    *     "index": original index of file starting with 1
    *     "path": full file path
    *     "context": YAML front matter and grunt.config.data
    *     "content": content of file
    *   }
    */
  Handlebars.registerHelper("aggregate", function (src, options, compare_fn) {

    // Default options
    var opts = {
      cwd: '',
      sep: '\n',
      glob: {}
    };

    options = _.defaults(options.hash, assembleOpts.aggregate, opts);

    var content;
    compare_fn = (options.compare || compare_fn || compareFn);
    var index = 0;

    // Join path to 'cwd' if defined in the helper's options
    var cwd = path.join.bind(null, options.cwd, '');

    return glob.find(cwd(src), options.glob).map(function (path) {
      var context = yfm.extract(path).context;
      var content = yfm.extract(path).content;
      index += 1;
      return {
        index: index,
        path: path,
        context: processContext(grunt, context),
        content: content
      };
    }).sort(_.bind(compare_fn)).map(function (obj) {
      var template = Handlebars.compile(obj.content);
      return new Handlebars.SafeString(template(obj.context));
    }).join(options.sep);
  });

  /**
   * Process templates using grunt.config.data and context
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
};
