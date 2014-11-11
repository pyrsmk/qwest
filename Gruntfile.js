module.exports = function(grunt) {

	require('jit-grunt')(grunt);

	// Get version
	var child_process=require('child_process'),
		fs=require('fs'),
		version=fs.readFileSync('README.md',{encoding:'utf8'}).match(/^\w+ ([0-9.]+)/)[1];

	grunt.initConfig({
		// Load bower file
		bower: grunt.file.readJSON('bower.json'),
		// Remove obsolete files
		clean: {
			old: ['*.min.js']
		},
		// Lint
		jshint: {
			library: ['src/*.js'],
			options: {
				browser		: true,
				predef		: [
					'Document',
					'define',
					'module',
					'ActiveXObject',
					'console',
					'XDomainRequest',
					'log'
				],
				boss		: true,
				curly		: true,
				eqnull		: true,
				newcap		: true,
				undef		: true,
				loopfunc	: true,
				evil		: true,
				proto		: true,
				es3			: true,
			}
		},
		// Minify
		uglify: {
			options: {
				preserveComments: 'some'
			},
			library: {
				files: {
					'<%= bower.name %>.min.js': ['src/*.js']
				}
			}
		},
		// Prepare package.json
		'string-replace': {
			dev_define: {
				files: {'package.json':'package.json'},
				options:{
					replacements: [{
						pattern: /"version": "[0-9.]+",/,
						replacement: '"version": "'+version+'",'
					}]
				}
			}
		},
		// Publish on NPM
		shell: {
			options: {
				stderr: false
			},
			npm: {
				command: 'npm publish'
			},
			jam: {
				command: 'jam publish'
			}
		}
	});

	// Define tasks
	grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'string-replace'/*, 'shell'*/]);

};