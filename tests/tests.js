domready(function(){

	var global = this,
		methods = ['get', 'post', 'put', 'patch', 'delete'],
		i, j;

	if(!String.prototype.trim) {
		String.prototype.trim = function(){
			return global.replace(/^\s+|\s+$/g, '');
		};
	}

	QUnit.test('Qwest object',function(assert) {
		assert.expect(1);
		assert.ok(typeof qwest == 'object', 'is '+(typeof qwest));
	});

	QUnit.test('XHR2',function(assert) {
		assert.expect(1);
		assert.ok(Modernizr.xhr2 == qwest.xhr2);
	});

	QUnit.test('Base URL',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.base = /^.*\//.exec(global.location.href);
		qwest.get('../tests/base/test.php')
			 .then(function(xhr, response) {
				//console.log(response.debug);
				assert.ok(response.status=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
		qwest.base = '';
	});

	QUnit.test('REST requests (async)',function(assert){
		var done = assert.async();
		assert.expect(methods.length);
		var executed=0;
		for(i=0,j=methods.length;i<j;++i){
			qwest[methods[i]]('../tests/async/test.php?method='+methods[i].toUpperCase())
				 .then(function(method){
					return function(xhr, response) {
						//console.log(response.debug);
						assert.ok(response.status=='ok', method+' request');
						if(++executed==methods.length){
							done();
						}
					};
				 }(methods[i].toUpperCase()))
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					if(++executed==methods.length){
						done();
					}
				 });
		}
	});

	QUnit.test('REST requests (sync)',function(assert){
		var done = assert.async();
		assert.expect(methods.length);
		var executed=0;
		for(i=0,j=methods.length;i<j;++i){
			qwest[methods[i]]('../tests/async/test.php?method='+methods[i].toUpperCase(),null,{async:false})
				 .then(function(method){
					return function(xhr, response) {
						//console.log(response.debug);
						assert.ok(response.status=='ok', method+' request');
						if(++executed==methods.length){
							done();
						}
					};
				 }(methods[i].toUpperCase()))
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					if(++executed==methods.length){
						done();
					}
				 })
				 .send();
		}
	});

	QUnit.test('Manual requests (async)',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.map('PATCH', '../tests/async/test.php?method=PATCH')
			 .then(function(xhr, response) {
				//console.log(response.debug);
				assert.ok(response.status=='ok', 'PATCH request');
				done();
		 	 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Manual requests (sync)',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.map('PATCH', '../tests/async/test.php?method=PATCH', null, {async: false})
			 .then(function(xhr, response) {
				//console.log(response.debug);
				assert.ok(response.status=='ok', 'PATCH request');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 })
			 .send();
	});

	QUnit.test('Invalid URL', function(assert) {
		var done = assert.async();
		assert.expect(1);
		qwest.post('foo')
			 .then(function(xhr, response){
				assert.ok(false);
				done();
			 })
			 ['catch'](function(xhr, response, e) {
				assert.ok(true);
				done();
			 });
	});

	QUnit.test('Request limit (async)',function(assert){
		var done = assert.async();
		assert.expect(20);
		qwest.limit(5);
		var executed=0;
		for(i=1,j=20;i<=j;++i){
			qwest.get('../tests/limit/test.php')
				 .then(function(xhr, response){
					assert.ok(response.status=='ok');
					if(++executed==20){
						done();
						qwest.limit(null);
					}
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					if(++executed==20){
						done();
						qwest.limit(null);
					}
				 });
		}
	});

	QUnit.test('Request limit (sync)',function(assert){
		var done = assert.async();
		assert.expect(20);
		qwest.limit(5);
		var executed=0;
		for(i=1,j=20;i<=j;++i){
			qwest.get('../tests/limit/test.php',null,{async:false})
				 .then(function(xhr, response){
					assert.ok(response.status=='ok');
					if(++executed==20){
						done();
						qwest.limit(null);
					}
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					if(++executed==20){
						done();
						qwest.limit(null);
					}
				 })
				 .send();
		}
	});

	QUnit.test('Timeout (async)',function(assert){
		var done = assert.async();
		assert.expect(1);
		var t=+new Date;
		qwest.get('../tests/timeout/test.php',null,{
				timeout: 250,
				attempts: 4
			 })
			 .then(function(xhr, response){
				assert.ok(false,(+new Date-t)+'ms');
				done();
			 })
			 ['catch'](function(xhr, response, e){
			 	//console.log(message);
				assert.ok((+new Date-t)>=1000,(+new Date-t)+'ms');
				done();
			 });
	});

	QUnit.test('Timeout (sync)',function(assert){
		var done = assert.async();
		assert.expect(1);
		var t=+new Date;
		qwest.get('../tests/timeout/test.php',null,{
				timeout: 250,
				attempts: 4,
				async: false
			 })
			 .then(function(xhr, response){
				assert.ok(false,(+new Date-t)+'ms');
				done();
			 })
			 ['catch'](function(xhr, response, e){
			 	//console.log(response);
				assert.ok((+new Date-t)>=1000,(+new Date-t)+'ms');
				done();
			 })
			 .send();
	});

	QUnit.test('CORS',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.get('http://sandbox.dreamysource.fr/cors/index.php')
			 .then(function(xhr, response){
				assert.ok(response.status=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Before',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.get('../tests/before/test.php', null, null, function(xhr){
				xhr.setRequestHeader('X-Running-Test','before');
			 })
			 .then(function(xhr, response){
				//console.log(response.debug);
				assert.ok(response.status=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Cache',function(assert){
		var done = assert.async();
		assert.expect(2);
		var a,b,
			phase2=function(){
				qwest.get('../tests/cache/test.php',null,{responseType:'text', cache:true})
					 .then(function(xhr, response){
						//console.log(response);
						b=response;
						qwest.get('../tests/cache/test.php',null,{responseType: 'text', cache:true})
							 .then(function(xhr, response){
								//console.log(response);
								assert.ok(response==b,'Cached');
								done();
							 })
							 ['catch'](function(message){
								assert.ok(false,message);
								done();
							 });
					 })
					 ['catch'](function(xhr, response, e){
						assert.ok(false, e);
						done();
					 });
			};
		qwest.get('../tests/cache/test.php',null,{responseType:'text'})
			 .then(function(xhr, response){
				//console.log(response);
				a=response;
				qwest.get('../tests/cache/test.php',null,{responseType:'text'})
					 .then(function(xhr, response){
						//console.log(response);
						assert.ok(response!=a,'Not cached');
						phase2();
					 })
					 ['catch'](function(xhr, response, e){
						assert.ok(false, e);
						phase2();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				phase2();
			 });
	});

	QUnit.test('Authentication',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.get('../tests/auth/test.php',null,{
				user: 'pyrsmk',
				password: 'test'
			 })
			 .then(function(xhr, response){
				//console.log(response.debug);
				assert.ok(response.status=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Get JSON response',function(assert){
		var done = assert.async();
		assert.expect(2);
		qwest.get('../tests/get_json/test.php',null,{responseType:'json'})
			 .then(function(xhr, response){
				//console.log(response.debug);
				assert.ok(response.status=='ok','Manual');
				qwest.get('../tests/get_json/test.php',null,{headers:{'Accept':'application/json'}})
					 .then(function(xhr, response){
						//console.log(response.debug);
						assert.ok(response.status=='ok','Auto');
						done();
					 })
					 ['catch'](function(xhr, response, e){
						assert.ok(false, e);
						done();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Get DOMString response',function(assert){
		var done = assert.async();
		assert.expect(2);
		qwest.get('../tests/get_text/test.php',null,{responseType:'text'})
			 .then(function(xhr, response){
				assert.ok(response=='ok','Manual');
				qwest.get('../tests/get_text/test.php')
					 .then(function(xhr, response){
						//console.log(response.debug);
						assert.ok(response=='ok','Auto');
						done();
					 })
					 ['catch'](function(xhr, response, e){
						assert.ok(false, e);
						done();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Get XML response',function(assert){
		var done = assert.async();
		assert.expect(2);
		qwest.get('../tests/get_xml/test.php',null,{responseType:'xml'})
			 .then(function(xhr, response){
				//console.log(response.getElementsByTagName('status')[0]);
				assert.ok(response.getElementsByTagName('status')[0].textContent=='ok','Manual');
				qwest.get('../tests/get_xml/test.php')
					 .then(function(xhr, response){
						//console.log(response.debug);
						assert.ok(response.getElementsByTagName('status')[0].textContent=='ok','Auto');
						done();
					 })
					 ['catch'](function(xhr, response, e){
						assert.ok(false, e);
						done();
					 });
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	if('ArrayBuffer' in global){
		QUnit.test('Get ArrayBuffer response',function(assert){
			var done = assert.async();
			assert.expect(1);
			qwest.get('../tests/get_arraybuffer/test.php',null,{responseType:'arraybuffer'})
				 .then(function(xhr, response){
					var arrayBuffer=new Uint8Array(response),
						length=arrayBuffer.length;
					//console.log(arrayBuffer[0].toString(16));
					//console.log(arrayBuffer[1].toString(16));
					//console.log(arrayBuffer[length-2].toString(16));
					//console.log(arrayBuffer[length-1].toString(16));
					assert.ok(
						arrayBuffer[0].toString(16)=='ff' &&
						arrayBuffer[1].toString(16)=='d8' &&
						arrayBuffer[length-2].toString(16)=='ff' &&
						arrayBuffer[length-1].toString(16)=='d9'
					);
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}

	if('Blob' in global){
		QUnit.test('Get Blob response',function(assert){
			var done = assert.async();
			assert.expect(1);
			qwest.get('../tests/get_blob/test.php',null,{responseType:'blob'})
				 .then(function(xhr, response){
					//console.log(response);
					assert.ok(response.size);
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}

	if(qwest.xhr2 && global.document && 'querySelector' in global.document){
		QUnit.test('Get Document response',function(assert){
			var done = assert.async();
			assert.expect(1);
			qwest.get('../tests/get_document/test.php',null,{responseType:'document'})
				 .then(function(xhr, response){
					assert.ok(response.querySelector('p').innerHTML=='ok');
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}

	QUnit.test('Send basic POST data',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.post('../tests/send_post/test.php',{
				foo: 'bar',
				bar: [{foo:'bar'}]
			 })
			 .then(function(xhr, response){
			 	//console.log(response.debug);
				assert.ok(response.status.trim()=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Send JSON data',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.post('../tests/send_json/test.php',{
				foo: 'bar',
				bar: [{foo:'bar'}]
			 },{
				dataType: 'json'
			 })
			 .then(function(xhr, response){
				//console.log(response.debug);
				assert.ok(response.status=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	QUnit.test('Send DOMString data',function(assert){
		var done = assert.async();
		assert.expect(1);
		qwest.post('../tests/send_text/test.php','text',{dataType:'text'})
			 .then(function(xhr, response){
				//console.log(response.debug);
				assert.ok(response.status=='ok');
				done();
			 })
			 ['catch'](function(xhr, response, e){
				assert.ok(false, e);
				done();
			 });
	});

	if('FormData' in global){
		QUnit.test('Send FormData data',function(assert){
			var done = assert.async();
			assert.expect(1);
			var formData=new FormData();
			formData.append('firstname','Pedro');
			formData.append('lastname','Sanchez');
			qwest.post('../tests/send_formdata/test.php',formData)
				 .then(function(xhr, response){
					//console.log(response.debug);
					assert.ok(response.status=='ok');
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}

	if('Blob' in global){
		QUnit.test('Send Blob data',function(assert){
			var done = assert.async();
			assert.expect(1);
			var blob=new Blob(['test'],{type:'text/plain'});
			qwest.post('../tests/send_blob/test.php',blob)
				 .then(function(xhr, response){
					//console.log(response.debug);
					assert.ok(response.status=='ok');
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}

	if(qwest.xhr2){
		QUnit.test('Send Document data',function(assert){
			var done = assert.async();
			assert.expect(1);
			qwest.post('../tests/send_document/test.php',document)
				 .then(function(xhr, response){
					//console.log(response.debug);
					assert.ok(response.status=='ok');
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}

	if('ArrayBuffer' in global){
		QUnit.test('Send ArrayBuffer data',function(assert){
			var done = assert.async();
			assert.expect(1);
			var arrayBuffer=new Uint8Array([1,2,3]);
			qwest.post('../tests/send_arraybuffer/test.php',arrayBuffer)
				 .then(function(xhr, response){
					//console.log(response.debug);
					assert.ok(response.status=='ok');
					done();
				 })
				 ['catch'](function(xhr, response, e){
					assert.ok(false, e);
					done();
				 });
		});
	}
	
	QUnit.start();

});
