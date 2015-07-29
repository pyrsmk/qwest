var fs = require('fs'),
	gulp = require('gulp'),
	size = require('gulp-sizereport'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	resolve = require('resolve'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	merge = require('merge2'),
	shell = require('gulp-shell');

// ======================================== Config

var replacements = {
		browser: [
			{regex: /PINKYSWEAR/, string: 'window.pinkySwear'},
			{regex: /PARAM/, string: 'window.param'}
		],
		npm: [
			{regex: /PINKYSWEAR/, string: "require('pinkyswear')"},
			{regex: /PARAM/, string: "require('jquery-param')"}
		]
	};

// ======================================== gulp lint

gulp.task('lint', function() {

	return gulp.src( './src/qwest.js' )
		.pipe( jshint() )
		.pipe( jshint.reporter('jshint-stylish') );

});

// ======================================== gulp build

gulp.task('build', ['lint'], function() {

	var streams = merge(),
		files = [
			resolve.sync('jquery-param', {moduleDirectory: './node_modules'}),
			resolve.sync('pinkyswear', {moduleDirectory: './node_modules'}),
			'./src/qwest.js'
		];

	streams.add(
		gulp.src( files )
			.pipe( concat('qwest.js') )
			.pipe( replace(replacements.browser[0].regex, replacements.browser[0].string) )
			.pipe( replace(replacements.browser[1].regex, replacements.browser[1].string) )
			.pipe( size() )
			.pipe( gulp.dest('./tests/') )
			.pipe( uglify() )
			.pipe( rename('qwest.min.js') )
			.pipe( gulp.dest('.') )
			.pipe( size({gzip:true}) )
	);

	streams.add(
		gulp.src( files )
			.pipe( concat('qwest.js') )
			.pipe( replace(replacements.npm[0].regex, replacements.npm[0].string) )
			.pipe( replace(replacements.npm[1].regex, replacements.npm[1].string) )
			.pipe( size() )
			.pipe( uglify() )
			.pipe( rename('qwest.min.js') )
			.pipe( gulp.dest('./build/') )
			.pipe( size({gzip:true}) )
	);

	return streams;

});

// ======================================== gulp version

gulp.task('version', function() {

	var streams = merge(),
		version=fs.readFileSync('src/qwest.js', {encoding: 'utf8'}).match(/^\/\*\! \w+ ([0-9.]+)/)[1];

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

// ======================================== gulp publish

gulp.task('publish', function() {

	return gulp.src('.', {read: false})
				.pipe(shell([
					'npm publish',
					'jam publish'
				]));

});

// ======================================== gulp

gulp.task('default', ['build', 'version']);
