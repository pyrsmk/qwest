/*
 * grunt-string-replace
 * https://github.com/erickrdch/grunt-string-replace
 *
 * Copyright (c) 2014 Erick Ruiz de Chavez
 * Licensed under the MIT license.
 */
var util = require('util'),
  async = require('async'),
  chalk = require('chalk');

exports.init = function(grunt) {
  'use strict';

  var path = require('path');

  var detectDestType = function(dest) {
    if (dest[dest.length - 1] === '/') {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var unixifyPath = function(filepath) {
    var path = '';
    grunt.log.debug('unixifying ', filepath);
    if (process.platform === 'win32') {
      path = filepath.replace(/\\/g, '/');
    } else {
      path = filepath;
    }
    grunt.log.debug('unixified path is ', path);
    return path;
  };

  exports.replace = function(files, replacements, replace_done) {
    var content, dest;

    async.forEach(files, function(file, files_done) {
      async.forEach(file.src, function(src, src_done) {
        if (!grunt.file.exists(src)) {
          return src_done(src + ' file not found');
        }

        if (grunt.file.isDir(src)) {
          return src_done();
        }

        if (detectDestType(file.dest) === 'directory') {
          if (grunt.file.doesPathContain(file.dest, src)) {
            dest = path.join(file.dest, src.replace(file.dest, ''));
          } else {
            dest = path.join(file.dest, src);
          }
        } else {
          dest = file.dest;
        }

        dest = unixifyPath(dest);

        content = grunt.file.read(src);
        content = exports.multi_str_replace(content, replacements);
        grunt.file.write(dest, content);
        grunt.log.writeln('File ' + chalk.cyan(dest) + ' created.');

        return src_done();
      }, files_done);
    }, function(err) {
      if (err) {
        grunt.log.error(err);
        replace_done(false);
      }
      replace_done();
    });
  };

  exports.normalize_replacements = function(replacements) {
    return replacements.map(function(replacement) {
      return [replacement.pattern, replacement.replacement];
    });
  };

  exports.multi_str_replace = function(string, replacements) {
    return replacements.reduce(function(content, replacement) {
      return content.replace(replacement[0], replacement[1]);
    }, string);
  };

  return exports;
};
