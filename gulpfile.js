var fs = require('fs'),
	gulp = require('gulp'),
	size = require('gulp-sizereport'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	resolve = require('resolve'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	merge = require('merge2'),
	shell = require('gulp-shell'),
	browserify = require('browserify'),
	resolve = require('resolve'),
	through2 = require('through2'),
	_ = require('lodash');

// ======================================== gulp version

gulp.task('version', function() {

	var streams = merge(),
		version = fs.readFileSync('./src/qwest.js', {encoding: 'utf8'}).match(/^\/\*\! \w+ ([0-9.]+)/)[1];

	streams.add(
		gulp.src( './package.json' )
			.pipe( replace(/"version": "[0-9.]+",/, '"version": "'+version+'",') )
			.pipe( gulp.dest('.') )
	);

	streams.add(
		gulp.src( './README.md' )
			.pipe( replace(/^(\w+) [0-9.]+/, '$1 '+version) )
			.pipe( gulp.dest('.') )
	);

	return streams;

});

// ======================================== gulp lint

gulp.task('lint', function() {

	return gulp.src( './src/qwest.js' )
		.pipe( jshint() )
		.pipe( jshint.reporter('jshint-stylish') );

});

// ======================================== gulp build

gulp.task('build', ['version', 'lint'], function() {
	
	/*
		https://www.npmjs.com/package/derequire
		https://github.com/substack/webworkify
	*/
	
	return gulp.src( './src/qwest.js' )
				.pipe( size() )
				.pipe( through2.obj(function(file, enc, next) {
		
					var b = browserify(null, {standalone: 'qwest'});
		
					(_.keys(require('./package.json').dependencies) || []).forEach(function(name) {
						b.add(resolve.sync(name, {moduleDirectory: './node_modules/'}));
					});
		
					b.require('./src/qwest.js', {expose: 'qwest'});
		
					b.bundle(function(err, res) {
						file.contents = res;
						next(null, file);
					});
		
				}) )
				//.pipe( uglify() )
				.pipe( rename('qwest.min.js') )
				.pipe( gulp.dest('.') )
				.pipe( size({gzip:true}) );

});

// ======================================== gulp publish

gulp.task('publish', function() {

	return gulp.src('.', {read: false})
				.pipe(shell([
					'npm publish',
					'jam publish'
				]));

});

// ======================================== gulp

gulp.task('default', ['build']);
