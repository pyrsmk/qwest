var domready = function(func) {
	func();
};

importScripts(
	'../../qwest.min.js',
	'../node_modules/requirejs/require.js'
);

requirejs.config({
	baseUrl: '.',
	paths: {
		'qunit': '../node_modules/qunitjs/qunit/qunit',
		'tap': '../node_modules/qunit-tap/lib/qunit-tap'
	}
});

require(['qunit', 'tap'], function(qunit, tap, toast) {
	this.QUnit = qunit;
	tap(QUnit, function() {
		console.log.apply(console, arguments);
	});
	importScripts('../tests.js');
});

