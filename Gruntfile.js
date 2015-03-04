module.exports = function(grunt) {

	// Requires
	require('jit-grunt')(grunt);
	var fs=require('fs'),
		child_process=require('child_process'),
		glob=require('glob'),
		path=require('path');

	// Get library name
	var excludes=['ender.js','footer.js'],
		name;
	files = glob.sync('src/*.js').filter(function (f) {
		return ! excludes.every(function (e) {
			return path.basename(f).indexOf(e) >= 0
		});
	});
	name = path.basename(files[0]);

	// Get version
	var version=fs.readFileSync('src/'+name,{encoding:'utf8'}).match(/^\/\*\! \w+ ([0-9.]+)/)[1];

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
		// Change library version across files
		'string-replace': {
			package_json: {
				files: {'package.json':'package.json'},
				options:{
					replacements: [{
						pattern: /"version": "[0-9.]+",/,
						replacement: '"version": "'+version+'",'
					}]
				}
			},
			README_md: {
				files: {'README.md':'README.md'},
				options:{
					replacements: [{
						pattern: /^(\w+) [0-9.]+/,
						replacement: '$1 '+version
					}]
				}
			}
		},
		// Publish on package managers
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
	grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'string-replace', 'shell']);

};
