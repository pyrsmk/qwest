domready(function(){

	if(!String.prototype.trim){
		String.prototype.trim=function(){
			return this.replace(/^\s+|\s+$/g,'');
		};
	}

	var methods=['get','post','put','delete'],
		i,j;

	test('XHR2',function(){
		expect(1);
		ok(Modernizr.xhr2==qwest.xhr2);
	});

	asyncTest('Asynchroneous REST requests',function(){
		expect(4);
		var executed=0;
		for(i=0,j=methods.length;i<j;++i){
			qwest[methods[i]]('tests/async/test.php?method='+methods[i].toUpperCase())
				 .then(function(method){
					return function(response){
						//console.log(response.debug);
						ok(response.status=='ok',method+' request');
						if(++executed==4){
							start();
						}
					};
				 }(methods[i].toUpperCase()))
				 ['catch'](function(message){
					ok(false,message);
					if(++executed==4){
						start();
					}
				 });
		}
	});

	test('Synchroneous REST requests',function(){
		expect(4);
		for(i=0,j=methods.length;i<j;++i){
			qwest[methods[i]]('tests/sync/test.php?method='+methods[i].toUpperCase(),null,{async:false})
				 .then(function(response){
					//console.log(response.debug);
					ok(response.status=='ok',methods[i].toUpperCase()+' request');
				 })
				 ['catch'](function(message){
					ok(false,message);
				 });
		}
	});

	asyncTest('Multiple promises (async)',function(){
		expect(2);
		var a=0,b=0,c=0;
		qwest.get('tests/multiple/test.php')
			 .then(function(response){
				++a;
			 })
			 ['catch'](function(message){
				++b;
			 })
			 .then(function(response){
				++a;
			 })
			 .complete(function(){
				++c;
			 })
			 .complete(function(){
				++c;
				ok(a==3 && b==0 && c==2,a+'/'+b+'/'+c);
				a=0;
				b=0;
				c=0;
				qwest.get('tests/multiple/test2.php')
					 .then(function(response){
						++a;
					 })
					 ['catch'](function(message){
						++b;
					 })
					 .then(function(response){
						++a;
					 })
					 .complete(function(){
						++c;
					 })
					 .complete(function(){
						++c;
						ok(a==0 && b==2 && c==2,a+'/'+b+'/'+c);
						start();
					 })
					 .then(function(response){
						++a;
					 })
					 ['catch'](function(message){
						++b;
					 });
			 })
			 .then(function(response){
				++a;
			 })
			 ['catch'](function(message){
				++b;
			 });
	});

	test('Multiple promises (sync)',function(){
		expect(2);
		var a=0,b=0,c=0;
		qwest.get('tests/multiple/test.php',null,{async:false})
			 .then(function(response){
				++a;
			 })
			 ['catch'](function(message){
				++b;
			 })
			 .then(function(response){
				++a;
			 })
			 .complete(function(){
				++c;
			 })
			 .complete(function(){
				++c;
			 })
			 .then(function(response){
				++a;
			 })
			 ['catch'](function(message){
				++b;
			 });
		ok(a==3 && b==0 && c==2,a+'/'+b+'/'+c);
		a=0;
		b=0;
		c=0;
		qwest.get('tests/multiple/test2.php',null,{async:false})
			 .then(function(response){
				++a;
			 })
			 ['catch'](function(message){
				++b;
			 })
			 .then(function(response){
				++a;
			 })
			 .complete(function(){
				++c;
			 })
			 .complete(function(){
				++c;
			 })
			 .then(function(response){
				++a;
			 })
			 ['catch'](function(message){
				++b;
			 });
		ok(a==0 && b==2 && c==2,a+'/'+b+'/'+c);
	});

	asyncTest('Request limitation (async)',function(){
		expect(20);
		qwest.limit(20);
		var executed=0;
		for(i=1,j=20;i<=j;++i){
			qwest.get('tests/limit/test.php')
				 .then(function(response){
					ok(response.status=='ok');
					if(++executed==20){
						start();
					}
				 })
				 ['catch'](function(message){
					ok(false,message);
					if(++executed==20){
						start();
					}
				 });
		}
		qwest.limit(null);
	});

	test('Request limitation (sync)',function(){
		expect(20);
		qwest.limit(20);
		for(i=1,j=20;i<=j;++i){
			qwest.get('tests/limit/test.php',null,{async:false})
				 .then(function(response){
					ok(response.status=='ok');
				 })
				 ['catch'](function(message){
					ok(false,message);
				 });
		}
		qwest.limit(null);
	});

	asyncTest('Timeout (async)',function(){
		expect(1);
		var t=+new Date;
		qwest.get('tests/timeout/test.php',null,{
				timeout: 250,
				retries: 4
			 })
			 .then(function(response){
				ok(false,(+new Date-t)+'ms');
				start();
			 })
			 ['catch'](function(message){
			 	//console.log(message);
				ok((+new Date-t)>=1000,(+new Date-t)+'ms');
				start();
			 });
	});

	test('Timeout (sync)',function(){
		expect(1);
		var t=+new Date;
		qwest.get('tests/timeout/test.php',null,{
				timeout: 500,
				retries: 4,
				async: false
			 })
			 .then(function(response){
				ok(response.status=='ok',(+new Date-t)+'ms');
			 })
			 ['catch'](function(message){
				ok(false,message);
			 });
	});

	asyncTest('CORS',function(){
		expect(1);
		qwest.get('http://sandbox.dreamysource.fr/cors/')
			 .then(function(response){
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Before promise',function(){
		expect(1);
		qwest.before(function(){
				this.setRequestHeader('X-Running-Test','before');
			 })
			 .get('tests/before/test.php')
			 .then(function(response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Cache',function(){
		expect(2);
		var a,b,
			phase2=function(){
				qwest.post('tests/cache/test.php',null,{responseType:'text'})
					 .then(function(response){
						//console.log(response);
						b=response;
						qwest.post('tests/cache/test.php',null,{responseType: 'text'})
							 .then(function(response){
								//console.log(response);
								ok(response==b,'POST request');
								start();
							 })
							 ['catch'](function(message){
								ok(false,message);
								start();
							 });
					 })
					 ['catch'](function(message){
						ok(false,message);
						start();
					 });
			};
		qwest.get('tests/cache/test.php',null,{responseType:'text'})
			 .then(function(response){
				//console.log(response);
				a=response;
				qwest.get('tests/cache/test.php',null,{responseType:'text'})
					 .then(function(response){
						//console.log(response);
						ok(response!=a,'GET request');
						phase2();
					 })
					 ['catch'](function(message){
						ok(false,message);
						phase2();
					 });
			 })
			 ['catch'](function(message){
				ok(false,message);
				phase2();
			 });
	});

	asyncTest('Authentication',function(){
		expect(1);
		qwest.get('tests/auth/test.php',null,{
				user: 'pyrsmk',
				password: 'test'
			 })
			 .then(function(response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Get JSON response',function(){
		expect(2);
		qwest.get('tests/get_json/test.php',null,{responseType:'json'})
			 .then(function(response){
				//console.log(response.debug);
				ok(response.status=='ok','Manual');
				qwest.get('tests/get_json/test.php',null,{headers:{'Accept':'application/json'}})
					 .then(function(response){
						//console.log(response.debug);
						ok(response.status=='ok','Auto');
						start();
					 })
					 ['catch'](function(message){
						ok(false,message);
						start();
					 });
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Get DOMString response',function(){
		expect(2);
		qwest.get('tests/get_text/test.php',null,{responseType:'text'})
			 .then(function(response){
				//console.log(response);
				ok(response=='ok','Manual');
				qwest.get('tests/get_text/test.php')
					 .then(function(response){
						//console.log(response.debug);
						ok(response=='ok','Auto');
						start();
					 })
					 ['catch'](function(message){
						ok(false,message);
						start();
					 });
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Get XML response',function(){
		expect(2);
		qwest.get('tests/get_xml/test.php',null,{responseType:'xml'})
			 .then(function(response){
				//console.log(response.getElementsByTagName('status')[0]);
				ok(response.getElementsByTagName('status')[0].textContent=='ok','Manual');
				qwest.get('tests/get_xml/test.php')
					 .then(function(response){
						//console.log(response.debug);
						ok(response.getElementsByTagName('status')[0].textContent=='ok','Auto');
						start();
					 })
					 ['catch'](function(message){
						ok(false,message);
						start();
					 });
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	if('ArrayBuffer' in window){
		asyncTest('Get ArrayBuffer response',function(){
			expect(1);
			qwest.get('tests/get_arraybuffer/test.php',null,{responseType:'arraybuffer'})
				 .then(function(response){
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
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

	if('Blob' in window){
		asyncTest('Get Blob response',function(){
			expect(1);
			qwest.get('tests/get_blob/test.php',null,{responseType:'blob'})
				 .then(function(response){
					//console.log(response);
					ok(response.size);
					start();
				 })
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

	if(qwest.xhr2 && 'querySelector' in document){
		asyncTest('Get Document response',function(){
			expect(1);
			qwest.get('tests/get_document/test.php',null,{responseType:'document'})
				 .then(function(response){
					ok(response.querySelector('p').innerHTML=='ok');
					start();
				 })
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

	asyncTest('Send basic POST data',function(){
		expect(1);
		qwest.post('tests/send_post/test.php',{
				foo: 'bar',
				bar: [{foo:'bar'}]
			 })
			 .then(function(response){
			 	//console.log(response.debug);
				ok(response.status.trim()=='ok');
				start();
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Send JSON data',function(){
		expect(1);
		qwest.post('tests/send_json/test.php',{
				foo: 'bar',
				bar: [{foo:'bar'}]
			 },{
				dataType: 'json'
			 })
			 .then(function(response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	asyncTest('Send DOMString data',function(){
		expect(1);
		qwest.post('tests/send_text/test.php','text',{dataType:'text'})
			 .then(function(response){
				//console.log(response.debug);
				ok(response.status=='ok');
				start();
			 })
			 ['catch'](function(message){
				ok(false,message);
				start();
			 });
	});

	if('FormData' in window){
		asyncTest('Send FormData data',function(){
			expect(1);
			var formData=new FormData();
			formData.append('firstname','Pedro');
			formData.append('lastname','Sanchez');
			qwest.post('tests/send_formdata/test.php',formData)
				 .then(function(response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

	if('Blob' in window){
		asyncTest('Send Blob data',function(){
			expect(1);
			var blob=new Blob(['test'],{type:'text/plain'});
			qwest.post('tests/send_blob/test.php',blob)
				 .then(function(response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

	if(qwest.xhr2){
		asyncTest('Send Document data',function(){
			expect(1);
			qwest.post('tests/send_document/test.php',document)
				 .then(function(response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

	if('ArrayBuffer' in window){
		asyncTest('Send ArrayBuffer data',function(){
			expect(1);
			var arrayBuffer=new Uint8Array([1,2,3]);
			qwest.post('tests/send_arraybuffer/test.php',arrayBuffer)
				 .then(function(response){
					//console.log(response.debug);
					ok(response.status=='ok');
					start();
				 })
				 ['catch'](function(message){
					ok(false,message);
					start();
				 });
		});
	}

});
