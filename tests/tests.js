domready(function(){

	if(!String.prototype.trim){
		String.prototype.trim=function(){
			return this.replace(/^\s+|\s+$/g,'');
		};
	}

	var methods=['get','post','put','delete'],
		i,j;

	test('Qwest object',function() {
		expect(1);
		ok(typeof qwest == 'object', 'is '+(typeof qwest));
	});

	test('XHR2',function() {
		expect(1);
		ok(Modernizr.xhr2 == qwest.xhr2);
	});

	asyncTest('Base URL',function(){
		expect(1);
		qwest.base = /^.*\//.exec(window.location.href);
		qwest.get('../tests/base/test.php')
			 .then(function(xhr, response) {
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
		qwest.base = '';
	});

	asyncTest('REST requests (async)',function(){
		expect(methods.length);
		var executed=0;
		for(i=0,j=methods.length;i<j;++i){
			qwest[methods[i]]('../tests/async/test.php?method='+methods[i].toUpperCase())
				 .then(function(method){
					return function(xhr, response) {
						//console.log(response.debug);
						ok(response.status=='ok', method+' request');
						if(++executed==methods.length){
							start();
						}
					};
				 }(methods[i].toUpperCase()))
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					if(++executed==methods.length){
						start();
					}
				 });
		}
	});

	asyncTest('REST requests (sync)',function(){
		expect(methods.length);
		var executed=0;
		for(i=0,j=methods.length;i<j;++i){
			qwest[methods[i]]('../tests/async/test.php?method='+methods[i].toUpperCase(),null,{async:false})
				 .then(function(method){
					return function(xhr, response) {
						//console.log(response.debug);
						ok(response.status=='ok', method+' request');
						if(++executed==methods.length){
							start();
						}
					};
				 }(methods[i].toUpperCase()))
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					if(++executed==methods.length){
						start();
					}
				 })
				 .send();
		}
	});

	asyncTest('Manual requests (async)',function(){
		expect(1);
		qwest.map('PATCH', '../tests/async/test.php?method=PATCH')
			 .then(function(xhr, response) {
				//console.log(response.debug);
				ok(response.status=='ok', 'PATCH request');
				start();
		 	 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Manual requests (sync)',function(){
		expect(1);
		qwest.map('PATCH', '../tests/async/test.php?method=PATCH', null, {async: false})
			 .then(function(xhr, response) {
				//console.log(response.debug);
				ok(response.status=='ok', 'PATCH request');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 })
			 .send();
	});

	asyncTest('Invalid URL', function() {
		expect(1);
		qwest.post('foo')
			 .then(function(xhr, response){
				ok(false);
				start();
			 })
			 ['catch'](function(xhr, response, e) {
				ok(true);
				start();
			 });
	});

	asyncTest('Request limit (async)',function(){
		expect(20);
		qwest.limit(5);
		var executed=0;
		for(i=1,j=20;i<=j;++i){
			qwest.get('../tests/limit/test.php')
				 .then(function(xhr, response){
					ok(response.status=='ok');
					if(++executed==20){
						start();
						qwest.limit(null);
					}
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					if(++executed==20){
						start();
						qwest.limit(null);
					}
				 });
		}
	});

	asyncTest('Request limit (sync)',function(){
		expect(20);
		qwest.limit(5);
		var executed=0;
		for(i=1,j=20;i<=j;++i){
			qwest.get('../tests/limit/test.php',null,{async:false})
				 .then(function(xhr, response){
					ok(response.status=='ok');
					if(++executed==20){
						start();
						qwest.limit(null);
					}
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					if(++executed==20){
						start();
						qwest.limit(null);
					}
				 })
				 .send();
		}
	});

	asyncTest('Timeout (async)',function(){
		expect(1);
		var t=+new Date;
		qwest.get('../tests/timeout/test.php',null,{
				timeout: 250,
				attempts: 4
			 })
			 .then(function(xhr, response){
				ok(false,(+new Date-t)+'ms');
				start();
			 })
			 ['catch'](function(xhr, response, e){
			 	//console.log(message);
				ok((+new Date-t)>=1000,(+new Date-t)+'ms');
				start();
			 });
	});

	asyncTest('Timeout (sync)',function(){
		expect(1);
		var t=+new Date;
		qwest.get('../tests/timeout/test.php',null,{
				timeout: 250,
				attempts: 4,
				async: false
			 })
			 .then(function(xhr, response){
				ok(false,(+new Date-t)+'ms');
				start();
			 })
			 ['catch'](function(xhr, response, e){
			 	//console.log(response);
				ok((+new Date-t)>=1000,(+new Date-t)+'ms');
				start();
			 })
			 .send();
	});

	asyncTest('CORS',function(){
		expect(1);
		qwest.get('http://sandbox.dreamysource.fr/cors/index.php')
			 .then(function(xhr, response){
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Before',function(){
		expect(1);
		qwest.get('../tests/before/test.php', null, null, function(xhr){
				xhr.setRequestHeader('X-Running-Test','before');
			 })
			 .then(function(xhr, response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Cache',function(){
		expect(2);
		var a,b,
			phase2=function(){
				qwest.get('../tests/cache/test.php',null,{responseType:'text', cache:true})
					 .then(function(xhr, response){
						//console.log(response);
						b=response;
						qwest.get('../tests/cache/test.php',null,{responseType: 'text', cache:true})
							 .then(function(xhr, response){
								//console.log(response);
								ok(response==b,'Cached');
								start();
							 })
							 ['catch'](function(message){
								ok(false,message);
								start();
							 });
					 })
					 ['catch'](function(xhr, response, e){
						ok(false, e);
						start();
					 });
			};
		qwest.get('../tests/cache/test.php',null,{responseType:'text'})
			 .then(function(xhr, response){
				//console.log(response);
				a=response;
				qwest.get('../tests/cache/test.php',null,{responseType:'text'})
					 .then(function(xhr, response){
						//console.log(response);
						ok(response!=a,'Not cached');
						phase2();
					 })
					 ['catch'](function(xhr, response, e){
						ok(false, e);
						phase2();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				phase2();
			 });
	});

	asyncTest('Authentication',function(){
		expect(1);
		qwest.get('../tests/auth/test.php',null,{
				user: 'pyrsmk',
				password: 'test'
			 })
			 .then(function(xhr, response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Get JSON response',function(){
		expect(2);
		qwest.get('../tests/get_json/test.php',null,{responseType:'json'})
			 .then(function(xhr, response){
				//console.log(response.debug);
				ok(response.status=='ok','Manual');
				qwest.get('../tests/get_json/test.php',null,{headers:{'Accept':'application/json'}})
					 .then(function(xhr, response){
						//console.log(response.debug);
						ok(response.status=='ok','Auto');
						start();
					 })
					 ['catch'](function(xhr, response, e){
						ok(false, e);
						start();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Get DOMString response',function(){
		expect(2);
		qwest.get('../tests/get_text/test.php',null,{responseType:'text'})
			 .then(function(xhr, response){
				ok(response=='ok','Manual');
				qwest.get('../tests/get_text/test.php')
					 .then(function(xhr, response){
						//console.log(response.debug);
						ok(response=='ok','Auto');
						start();
					 })
					 ['catch'](function(xhr, response, e){
						ok(false, e);
						start();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Get XML response',function(){
		expect(2);
		qwest.get('../tests/get_xml/test.php',null,{responseType:'xml'})
			 .then(function(xhr, response){
				//console.log(response.getElementsByTagName('status')[0]);
				ok(response.getElementsByTagName('status')[0].textContent=='ok','Manual');
				qwest.get('../tests/get_xml/test.php')
					 .then(function(xhr, response){
						//console.log(response.debug);
						ok(response.getElementsByTagName('status')[0].textContent=='ok','Auto');
						start();
					 })
					 ['catch'](function(xhr, response, e){
						ok(false, e);
						start();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	if('ArrayBuffer' in window){
		asyncTest('Get ArrayBuffer response',function(){
			expect(1);
			qwest.get('../tests/get_arraybuffer/test.php',null,{responseType:'arraybuffer'})
				 .then(function(xhr, response){
					var arrayBuffer=new Uint8Array(response),
						length=arrayBuffer.length;
					//console.log(arrayBuffer[0].toString(16));
					//console.log(arrayBuffer[1].toString(16));
					//console.log(arrayBuffer[length-2].toString(16));
					//console.log(arrayBuffer[length-1].toString(16));
					ok(
						arrayBuffer[0].toString(16)=='ff' &&
						arrayBuffer[1].toString(16)=='d8' &&
						arrayBuffer[length-2].toString(16)=='ff' &&
						arrayBuffer[length-1].toString(16)=='d9'
					);
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

	if('Blob' in window){
		asyncTest('Get Blob response',function(){
			expect(1);
			qwest.get('../tests/get_blob/test.php',null,{responseType:'blob'})
				 .then(function(xhr, response){
					//console.log(response);
					ok(response.size);
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

	if(qwest.xhr2 && 'querySelector' in document){
		asyncTest('Get Document response',function(){
			expect(1);
			qwest.get('../tests/get_document/test.php',null,{responseType:'document'})
				 .then(function(xhr, response){
					ok(response.querySelector('p').innerHTML=='ok');
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

	asyncTest('Send basic POST data',function(){
		expect(1);
		qwest.post('../tests/send_post/test.php',{
				foo: 'bar',
				bar: [{foo:'bar'}]
			 })
			 .then(function(xhr, response){
			 	//console.log(response.debug);
				ok(response.status.trim()=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Send JSON data',function(){
		expect(1);
		qwest.post('../tests/send_json/test.php',{
				foo: 'bar',
				bar: [{foo:'bar'}]
			 },{
				dataType: 'json'
			 })
			 .then(function(xhr, response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	asyncTest('Send DOMString data',function(){
		expect(1);
		qwest.post('../tests/send_text/test.php','text',{dataType:'text'})
			 .then(function(xhr, response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(xhr, response, e){
				ok(false, e);
				start();
			 });
	});

	if('FormData' in window){
		asyncTest('Send FormData data',function(){
			expect(1);
			var formData=new FormData();
			formData.append('firstname','Pedro');
			formData.append('lastname','Sanchez');
			qwest.post('../tests/send_formdata/test.php',formData)
				 .then(function(xhr, response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

	if('Blob' in window){
		asyncTest('Send Blob data',function(){
			expect(1);
			var blob=new Blob(['test'],{type:'text/plain'});
			qwest.post('../tests/send_blob/test.php',blob)
				 .then(function(xhr, response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

	if(qwest.xhr2){
		asyncTest('Send Document data',function(){
			expect(1);
			qwest.post('../tests/send_document/test.php',document)
				 .then(function(xhr, response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

	if('ArrayBuffer' in window){
		asyncTest('Send ArrayBuffer data',function(){
			expect(1);
			var arrayBuffer=new Uint8Array([1,2,3]);
			qwest.post('../tests/send_arraybuffer/test.php',arrayBuffer)
				 .then(function(xhr, response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(xhr, response, e){
					ok(false, e);
					start();
				 });
		});
	}

});
