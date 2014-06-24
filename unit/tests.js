domready(function(){

	asyncTest('Events',function(){
		expect(2);
		alert("Please trigger responsive events (resize window, zoom-in, zoom-out, text resize");
		var first,
			second;
		W(function(){
			if(!first){
				first=true;
				ok(true,'Event catched by first listener');
			}
		});
		W(function(){
			if(!second){
				second=true;
				ok(true,'Event catched by second listener');
				start();
			}
		});
	});

	test('Provided width',function(){
		expect(1);
		ok(W(1024)==64,'Format px width in ems [not optimized to pass with text size changing]');
	});

	test('Window width',function(){
		expect(1);
		alert("Is "+W()+" it the right current width?");
		ok(W(true)==W(W()),'Get current window width in ems');
	});

});
