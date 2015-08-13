/**
 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
 */
/*global define */
(function (global) {
    'use strict';

    var param = function (a) {
        var add = function (s, k, v) {
            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
            s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }, buildParams = function (prefix, obj, s) {
            var i, len, key;

            if (Object.prototype.toString.call(obj) === '[object Array]') {
                for (i = 0, len = obj.length; i < len; i++) {
                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
                }
            } else if (obj && obj.toString() === '[object Object]') {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (prefix) {
                            buildParams(prefix + '[' + key + ']', obj[key], s, add);
                        } else {
                            buildParams(key, obj[key], s, add);
                        }
                    }
                }
            } else if (prefix) {
                add(s, prefix, obj);
            } else {
                for (key in obj) {
                    add(s, key, obj[key]);
                }
            }
            return s;
        };
        return buildParams('', a, []).join('&').replace(/%20/g, '+');
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = param;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return param;
        });
    } else {
        global.param = param;
    }

}(this));

/*
 * PinkySwear.js 2.2.2 - Minimalistic implementation of the Promises/A+ spec
 *
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for
 * Minified.js and should be perfect for embedding.
 *
 *
 * PinkySwear has just three functions.
 *
 * To create a new promise in pending state, call pinkySwear():
 *         var promise = pinkySwear();
 *
 * The returned object has a Promises/A+ compatible then() implementation:
 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 *
 *
 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument:
 *         promise(true, [42]);
 *
 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
 *         promise(true, [6, 6, 6]);
 *
 * You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
 * false if rejected, and otherwise undefined.
 * 		   var state = promise();
 *
 * https://github.com/timjansen/PinkySwear.js
 */
(function(target) {
	var undef;

	function isFunction(f) {
		return typeof f == 'function';
	}
	function isObject(f) {
		return typeof f == 'object';
	}
	function defer(callback) {
		if (typeof setImmediate != 'undefined')
			setImmediate(callback);
		else if (typeof process != 'undefined' && process['nextTick'])
			process['nextTick'](callback);
		else
			setTimeout(callback, 0);
	}

	target[0][target[1]] = function pinkySwear(extend) {
		var state;           // undefined/null = pending, true = fulfilled, false = rejected
		var values = [];     // an array of values as arguments for the then() handlers
		var deferred = [];   // functions to call when set() is invoked

		var set = function(newState, newValues) {
			if (state == null && newState != null) {
				state = newState;
				values = newValues;
				if (deferred.length)
					defer(function() {
						for (var i = 0; i < deferred.length; i++)
							deferred[i]();
					});
			}
			return state;
		};

		set['then'] = function (onFulfilled, onRejected) {
			var promise2 = pinkySwear(extend);
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				function resolve(x) {
						    var then, cbCalled = 0;
		   					try {
				   				if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
										if (x === promise2)
											throw new TypeError();
										then['call'](x,
											function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
											function(value){ if (!cbCalled++) promise2(false,[value]);});
				   				}
				   				else
				   					promise2(true, arguments);
		   					}
		   					catch(e) {
		   						if (!cbCalled++)
		   							promise2(false, [e]);
		   					}
		   				}
		   				resolve(f.apply(undef, values || []));
		   			}
		   			else
		   				promise2(state, values);
				}
				catch (e) {
					promise2(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);
			return promise2;
		};
        if(extend){
            set = extend(set);
        }
		return set;
	};
})(typeof module == 'undefined' ? [window, 'pinkySwear'] : [module, 'exports']);


/*! qwest 2.0.6 (https://github.com/pyrsmk/qwest) */

;(function(context, name, definition) {
	if(typeof module!='undefined' && module.exports) {
		module.exports = definition;
	}
	else if(typeof define=='function' && define.amd) {
		define(definition);
	}
	else{
		context[name] = definition;
	}
}(this, 'qwest', function() {

	var win=window,
		doc=document,
		// Default response type for XDR in auto mode
		defaultXdrResponseType = 'json',
		// Variables for limit mechanism
		limit = null,
		requests = 0,
		request_stack = [],
		// Get XMLHttpRequest object
		getXHR = function(){
			return win.XMLHttpRequest?
					new win.XMLHttpRequest():
					new ActiveXObject('Microsoft.XMLHTTP');
		},
		// Guess XHR version
		xhr2 = (getXHR().responseType===''),

	// Core function
	qwest = function(method, url, data, options, before) {

		// Format
		method = method.toUpperCase();
		data = data || null;
		options = options || {};

		// Define variables
		var nativeResponseParsing = false,
			crossOrigin,
			xhr,
			xdr = false,
			timeoutInterval,
			aborted = false,
			attempts = 0,
			headers = {},
			mimeTypes = {
				text: '*/*',
				xml: 'text/xml',
				json: 'application/json',
				post: 'application/x-www-form-urlencoded'
			},
			accept = {
				text: '*/*',
				xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
				json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
			},
			contentType = 'Content-Type',
			vars = '',
			i, j,
			serialized,
			response,
			sending = false,
			delayed = false,
			timeout_start,

		// Create the promise
		promise = window.pinkySwear(function(pinky) {
			pinky['catch'] = function(f) {
				return pinky.then(null, f);
			};
			pinky.complete = function(f) {
				return pinky.then(f, f);
			};
			pinky.send = function() {
				// Prevent further send() calls
				if(sending) {
					return;
				}
				sending = true;
				// Reached request limit, get out!
				if(limit && ++requests==limit) {
					request_stack.push(pinky);
					return;
				}
				// Start the chrono
				timeout_start = Date.now();
				// Get XHR object
				xhr = getXHR();
				if(crossOrigin) {
					if(!('withCredentials' in xhr) && win.XDomainRequest) {
						xhr = new XDomainRequest(); // CORS with IE8/9
						xdr = true;
						if(method!='GET' && method!='POST') {
							method = 'POST';
						}
					}
				}
				// Open connection
				if(xdr) {
					xhr.open(method, url);
				}
				else {
					xhr.open(method, url, options.async, options.user, options.password);
					if(xhr2 && options.async) {
						xhr.withCredentials = options.withCredentials;
					}
				}
				// Set headers
				if(!xdr) {
					for(var i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}
				}
				// Verify if the response type is supported by the current browser
				if(xhr2 && options.responseType!='document' && options.responseType!='auto') { // Don't verify for 'document' since we're using an internal routine
					try {
						xhr.responseType = options.responseType;
						nativeResponseParsing = (xhr.responseType==options.responseType);
					}
					catch(e){}
				}
				// Plug response handler
				if(xhr2 || xdr) {
					xhr.onload = handleResponse;
					xhr.onerror = handleError;
				}
				else {
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4) {
							handleResponse();
						}
					};
				}
				// Override mime type to ensure the response is well parsed
				if(options.responseType!='auto' && 'overrideMimeType' in xhr) {
					xhr.overrideMimeType(mimeTypes[options.responseType]);
				}
				// Run 'before' callback
				if(before) {
					before(xhr);
				}
				// Send request
				if(xdr) {
					setTimeout(function(){ // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
						xhr.send(method!='GET'?data:null);
					},0);
				}
				else {
					xhr.send(method!='GET'?data:null);
				}
			};
			return pinky;
		}),

		// Handle the response
		handleResponse = function() {
			// Prepare
			var i, responseType;
			--requests;
			sending = false;
			// Verify timeout state
			// --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
			if(Date.now()-timeout_start >= options.timeout) {
				if(!options.attempts || ++attempts!=options.attempts) {
					promise.send();
				}
				else {
					promise(false, [xhr,response,new Error('Timeout ('+url+')')]);
				}
				return;
			}
			// Launch next stacked request
			if(request_stack.length) {
				request_stack.shift().send();
			}
			// Handle response
			try{
				// Process response
				if(nativeResponseParsing && 'response' in xhr && xhr.response!==null) {
					response = xhr.response;
				}
				else if(options.responseType == 'document') {
					var frame = doc.createElement('iframe');
					frame.style.display = 'none';
					doc.body.appendChild(frame);
					frame.contentDocument.open();
					frame.contentDocument.write(xhr.response);
					frame.contentDocument.close();
					response = frame.contentDocument;
					doc.body.removeChild(frame);
				}
				else{
					// Guess response type
					responseType = options.responseType;
					if(responseType == 'auto') {
						if(xdr) {
							responseType = defaultXdrResponseType;
						}
						else {
							var ct = xhr.getResponseHeader(contentType) || '';
							if(ct.indexOf(mimeTypes.json)>-1) {
								responseType = 'json';
							}
							else if(ct.indexOf(mimeTypes.xml)>-1) {
								responseType = 'xml';
							}
							else {
								responseType = 'text';
							}
						}
					}
					// Handle response type
					switch(responseType) {
						case 'json':
							try {
								if('JSON' in win) {
									response = JSON.parse(xhr.responseText);
								}
								else {
									response = eval('('+xhr.responseText+')');
								}
							}
							catch(e) {
								throw "Error while parsing JSON body : "+e;
							}
							break;
						case 'xml':
							// Based on jQuery's parseXML() function
							try {
								// Standard
								if(win.DOMParser) {
									response = (new DOMParser()).parseFromString(xhr.responseText,'text/xml');
								}
								// IE<9
								else {
									response = new ActiveXObject('Microsoft.XMLDOM');
									response.async = 'false';
									response.loadXML(xhr.responseText);
								}
							}
							catch(e) {
								response = undefined;
							}
							if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
								throw 'Invalid XML';
							}
							break;
						default:
							response = xhr.responseText;
					}
				}
				// Late status code verification to allow passing data when, per example, a 409 is returned
				// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
				if('status' in xhr && !/^2|1223/.test(xhr.status)) {
					throw xhr.status+' ('+xhr.statusText+')';
				}
				// Fulfilled
				promise(true, [xhr,response]);
			}
			catch(e) {
				// Rejected
				promise(false, [xhr,response,e]);
			}
		},

		// Handle errors
		handleError = function(e) {
			--requests;
			promise(false, [xhr,null,new Error('Connection aborted')]);
		};

		// Normalize options
		options.async = 'async' in options?!!options.async:true;
		options.cache = 'cache' in options?!!options.cache:false;
		options.dataType = 'dataType' in options?options.dataType.toLowerCase():'post';
		options.responseType = 'responseType' in options?options.responseType.toLowerCase():'auto';
		options.user = options.user || '';
		options.password = options.password || '';
		options.withCredentials = !!options.withCredentials;
		options.timeout = 'timeout' in options?parseInt(options.timeout,10):30000;
		options.attempts = 'attempts' in options?parseInt(options.attempts,10):1;

		// Guess if we're dealing with a cross-origin request
		i = url.match(/\/\/(.+?)\//);
		crossOrigin = i && (i[1]?i[1]!=location.host:false);

		// Prepare data
		if('ArrayBuffer' in win && data instanceof ArrayBuffer) {
			options.dataType = 'arraybuffer';
		}
		else if('Blob' in win && data instanceof Blob) {
			options.dataType = 'blob';
		}
		else if('Document' in win && data instanceof Document) {
			options.dataType = 'document';
		}
		else if('FormData' in win && data instanceof FormData) {
			options.dataType = 'formdata';
		}
		switch(options.dataType) {
			case 'json':
				data = JSON.stringify(data);
				break;
			case 'post':
				data = window.param(data);
		}

		// Prepare headers
		if(options.headers) {
			var format = function(match,p1,p2) {
				return p1 + p2.toUpperCase();
			};
			for(i in options.headers) {
				headers[i.replace(/(^|-)([^-])/g,format)] = options.headers[i];
			}
		}
		if(!headers[contentType] && method!='GET') {
			if(options.dataType in mimeTypes) {
				if(mimeTypes[options.dataType]) {
					headers[contentType] = mimeTypes[options.dataType];
				}
			}
		}
		if(!headers.Accept) {
			headers.Accept = (options.responseType in accept)?accept[options.responseType]:'*/*';
		}
		if(!crossOrigin && !headers['X-Requested-With']) { // (that header breaks in legacy browsers with CORS)
			headers['X-Requested-With'] = 'XMLHttpRequest';
		}
		if(!options.cache) {
			headers['Cache-Control'] = 'no-cache';
		}

		// Prepare URL
		if(method=='GET' && data) {
			vars += data;
		}
		if(vars) {
			url += (/\?/.test(url)?'&':'?')+vars;
		}

		// Start the request
		if(options.async) {
			promise.send();
		}

		// Return promise
		return promise;

	};

	// Return the external qwest object
	return {
		base: '',
		get: function(url, data, options, before) {
			return qwest('GET', this.base+url, data, options, before);
		},
		post: function(url, data, options, before) {
			return qwest('POST', this.base+url, data, options, before);
		},
		put: function(url, data, options, before) {
			return qwest('PUT', this.base+url, data, options, before);
		},
		'delete': function(url, data, options, before) {
			return qwest('DELETE', this.base+url, data, options, before);
		},
		map: function(type, url, data, options, before) {
			return qwest(type.toUpperCase(), this.base+url, data, options, before);
		},
		xhr2: xhr2,
		limit: function(by) {
			limit = by;
		},
		setDefaultXdrResponseType: function(type) {
			defaultXdrResponseType = type.toLowerCase();
		}
	};

}()));
