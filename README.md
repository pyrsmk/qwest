qwest 1.5.11
===========

Qwest is a simple ajax library based on `promises` behaviour and that supports `XmlHttpRequest2` special data like `ArrayBuffer`, `Blob` and `FormData`.

Install
-------

You can pick the minified library or install it with :

```
jam install qwest
bower install qwest
npm install qwest --save-dev
```

Quick examples
--------------

```javascript
qwest.get('example.com')
	 .then(function(response){
		alert(response);
	 });
```

```javascript
qwest.post('example.com',{
		firstname: 'Pedro',
		lastname: 'Sanchez',
		age: 30
	 })
	 .then(function(response){
		// Make some useful actions
	 })
	 .catch(function(e,url){
		// Process the error
	 });
```

Basics
------

```javascript
qwest.<method>(<url>[, data[, options]])
	 .then(function(response){
		// Run when the request is successful
	 })
	 .catch(function(e,url){
		// Process the error
	 })
	 .complete(function(){
		// Always run
	 });
```

The method is either `get`, `post`, `put` or `delete`. The `data` parameter can be a multi-dimensional array or object, a string, an ArrayBuffer, a Blob, etc... If you don't want to pass any data but specify some options, set data to `null`.

The available `options` are :

- dataType : `post` (by default), `json`, `text`, `arraybuffer`, `blob`, `document` or `formdata` (you don't need to specify XHR2 types since they're automatically detected)
- responseType : the response type; either `auto` (default), `json`, `xml`, `text`, `arraybuffer`, `blob` or `document`
- cache : browser caching; default is `false` for GET requests and `true` for POST requests
- async : `true` (default) or `false`; used to make asynchronous or synchronous requests
- user : the user to access to the URL, if needed
- password : the password to access to the URL, if needed
- headers : javascript object containing headers to be sent
- withCredentials : `false` by default; sends [credentials](http://www.w3.org/TR/XMLHttpRequest2/#user-credentials) with your XHR2 request ([more info in that post](https://dev.opera.com/articles/xhr2/#xhrcredentials))
- timeout : the timeout for the request in ms; `3000` by default
- attempts : the total number of times to attempt the request through timeouts; 3 by default; if you want to remove the limit set it to `null`

In each callback, the `this` keyword refers to the `XmlHttpRequest` object, so you can do some specific tasks you may need.

```javascript
qwest.get('example.com')
	 .then(function(response){
		// Blah blah blah
	 })
	 .catch(function(e,url){
		log(this.responseText);
		throw e+'('+url+')';
	 });
```

Request limitation
------------------

One of the great qwest's functionnalities is the request limitation. It avoids browser freezes and server overloads by freeing bandwidth and memory resources when you have a whole bunch of requests to do at the same time (when you load a gallery, per example). You just need to set the request limit and when the count is reached qwest will stock all further requests and start them when a slot is free.

```javascript
qwest.limit(4);

$('.foo').forEach(function(){
	qwest.get(this.data('some_url_to_get'));
});
```

If you want to remove the limit, do `qwest.limit(null)`.

Set options to XHR
------------------

If you want to apply some manual options to the `XHR` object, you can use the `before` promise. It must be called before __any__ other promise. The `this` keyword refers to the `XHR` object itself.

```javascript
qwest.before(function(){
		this.uploadonprogress=function(e){
			// Upload in progress
		};
	 })
	 .get('example.com')
	 .then(function(response){
		// Blah blah blah
	 });
```

Handling fallbacks
------------------

XHR2 is not available on every browser, so, if needed, you can simply verify the XHR version.

```javascript
if(qwest.xhr2){
	// Actions for XHR2
}
else{
	// Actions for XHR1
}
```

Receiving binary data in older browsers
---------------------------------------

Getting binary data in legacy browsers needs a trick, as we can read it on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Receiving_binary_data_in_older_browsers). In qwest, that's how we could handle it :

```javascript
qwest.before(function(){
		this.overrideMimeType('text\/plain; charset=x-user-defined');
	 })
	 .get('example.com/file')
	 .then(function(response){
	 	// response is now a binary string
	 });
```

Compatibility notes
-------------------

According to this [compatibility table](https://kangax.github.io/compat-table/es5), IE7/8 do not support using `catch` and `delete` as method name because these are reserved words. If you want to support those browsers you should write :

```javascript
qwest.delete('example.com')
	 .then(function(){})
	 .catch(function(){});
```

Like this :

```javascript
qwest['delete']('example.com')
	 .then(function(){})
	 ['catch'](function(){});
```

XHR2 does not support `arraybuffer`, `blob` and `document` response types in synchroneous mode.

The CORS object shipped with IE8 and 9 is `XDomainRequest`. This object __does not__ support `PUT` and `DELETE` requests and XHR2 types. Moreover, the `getResponseHeader()` method is not supported too which is used in the `auto` mode for detecting the reponse type. Then, the response type automatically fallbacks to `json` when in `auto` mode. If you expect another response type, please specify it explicitly. If you want to specify another default response type to fallback in `auto` mode, you can do it like this :

```js
qwest.setDefaultXdrResponseType('text');
```

Last notes
----------

- `auto` mode is only supported for `xml`, `json` and `text` response types; for `arraybuffer`, `blob` and `document` you'll need to define explicitly the `responseType` option
- if the response of your request doesn't return a valid (and recognized) `Content-Type` header, then you __must__ explicitly set the `responseType` option
- if an error occurs in a `then()` callback, it will be caught by the `catch()` promise
- the default `Content-Type` header is `application/x-www-form-urlencoded` for `post` and `xhr2` data types, with a `POST` request
- if you want to set or get raw data, set the related option to `text`
- as stated on [StackOverflow](https://stackoverflow.com/questions/8464262/access-is-denied-error-on-xdomainrequest), XDomainRequest forbid HTTPS requests from HTTP scheme and vice versa

License
-------

[MIT license](http://dreamysource.mit-license.org) everywhere!
