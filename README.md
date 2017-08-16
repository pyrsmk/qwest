qwest 4.5.0
===========

__A complete rewrite of qwest in ES6 with many improvements is planned soon. Keep in touch!__

Qwest is a simple ajax library based on `promises` and that supports `XmlHttpRequest2` special data like `ArrayBuffer`, `Blob` and `FormData`.

Install
-------

```
npm install qwest
bower install qwest
```

Qwest is also available via CDNJS : https://cdnjs.com/libraries/qwest

If you need to import qwest in TypeScript, do :

```js
import * as qwest from 'qwest';
```

Quick examples
--------------

```js
qwest.get('example.com')
     .then(function(xhr, response) {
        alert(response);
     });
```

```js
qwest.post('example.com', {
        firstname: 'Pedro',
        lastname: 'Sanchez',
        age: 30
     })
     .then(function(xhr, response) {
        // Make some useful actions
     })
     .catch(function(e, xhr, response) {
        // Process the error
     });
```

Basics
------

```js
qwest.`method`(`url`, `data`, `options`, `before`)
     .then(function(xhr, response) {
        // Run when the request is successful
     })
     .catch(function(e, xhr, response) {
        // Process the error
     })
     .complete(function() {
         // Always run
     });
```

The method is either `get`, `post`, `put` or `delete`. The `data` parameter can be a multi-dimensional array or object, a string, an ArrayBuffer, a Blob, etc... If you don't want to pass any data but specify some options, set data to `null`.

The available `options` are :

- dataType : `post` (by default), `queryString`, `json`, `text`, `arraybuffer`, `blob`, `document` or `formdata` (you shouldn't need to specify XHR2 types since they're automatically detected)
- responseType : the response type; either `auto` (default), `json`, `xml`, `text`, `arraybuffer`, `blob` or `document`
- cache : browser caching; default is `false`
- async : `true` (default) or `false`; used to make asynchronous or synchronous requests
- user : the user to access to the URL, if needed
- password : the password to access to the URL, if needed
- headers : javascript object containing headers to be sent
- withCredentials : `false` by default; sends [credentials](http://www.w3.org/TR/XMLHttpRequest2/#user-credentials) with your XHR2 request ([more info in that post](https://dev.opera.com/articles/xhr2/#xhrcredentials))
- timeout : the timeout for the request in ms; `30000` by default (allowed only in async mode)
- attempts : the total number of times to attempt the request through timeouts; 1 by default; if you want to remove the limit set it to `null`

You can change the default data type with :

```js
qwest.setDefaultDataType('json');
```

If you want to make a call with another HTTP method, you can use the `map()` function :

```js
qwest.map('PATCH', 'example.com')
     .then(function() {
         // Blah blah
     });
```

If you need to do a `sync` request, you must call `send()` at the end of your promise :

```js
qwest.get('example.com', {async: false})
     .then(function() {
         // Blah blah
     })
     .send();
```

Since service APIs often need the same type of request, you can set default options for all of your requests with :

```js
qwest.setDefaultOptions({
    dataType: 'arraybuffer',
    responseType: 'json',
    headers: {
        'My-Header': 'Some-Value'
    }
});
```

Note : if you want to send your data as a query string parameter chain, pass `queryString` to the `dataType` option.

Group requests
--------------

Sometimes we need to call several requests and execute some tasks after all of them are completed. You can simply do it by chaining your requests like :

```js
qwest.get('example.com/articles')
     .get('example.com/users')
     .post('example.com/login', auth_data)
     .then(function(values) {
         /*
            Prints [ [xhr, response], [xhr, response], [xhr, response] ]
        */
         console.log(values);
     });
```

If an error is encountered then `catch()` will be called and all requests will be aborted.

Base URI
--------

You can define a base URI for your requests. The string will be prepended to the other request URIs.

```js
qwest.base = 'http://example.com';

// Will make a request to 'http://example.com/somepage'
qwest.get('/somepage')
     .then(function() {
         // Blah blah
     });
```

Request limit
-------------

One of the greatest qwest functionnalities is the request limit. It avoids browser freezes and server overloads by freeing bandwidth and memory resources when you have a whole bunch of requests to do at the same time. Set the request limit and when the count is reached qwest will stock all further requests and start them when a slot is free.

Let's say we have a gallery with a lot of images to load. We don't want the browser to download all images at the same time to have a faster loading. Let's see how we can do that.

```html
<div class="gallery">
    <img data-src="images/image1.jpg" alt="">
    <img data-src="images/image2.jpg" alt="">
    <img data-src="images/image3.jpg" alt="">
    <img data-src="images/image4.jpg" alt="">
    <img data-src="images/image5.jpg" alt="">
    ...
</div>
```

```js
// Browsers are limited in number of parallel downloads, setting it to 4 seems fair
qwest.limit(4);

$('.gallery').children().forEach(function() {
    var $this = $(this);
    qwest.get($this.data('src'), {responseType: 'blob'})
         .then(function(xhr, response) {
            $this.attr('src', window.URL.createObjectURL(response));
            $this.fadeIn();
         });
});
```

If you want to remove the limit, set it to `null`.

CORS and preflight requests
---------------------------

According to [#90](https://github.com/pyrsmk/qwest/issues/90) and [#99](https://github.com/pyrsmk/qwest/issues/99), a CORS request will send a preflight `OPTIONS` request to the server to know what is allowed and what's not. It's because we're adding a `Cache-Control` header to handle caching of requests. The simplest way to avoid this `OPTIONS` request is to set `cache` option to `true`. If you want to know more about preflight requests and how to really handle them, read this : https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

Aborting a request
------------------

```js
// Start the request
var request = qwest.get('example.com')
                   .then(function(xhr, response) {
                       // Won't be called
                   })
                   .catch(function(xhr, response) {
                       // Won't be called either
                   });

// Some code

request.abort();
```

Not that only works with asynchroneous requests since synchroneous requests are... synchroneous.

Set options to the XHR object
-----------------------------

If you want to apply some manual options to the `XHR` object, you can use the `before` option

```js
qwest.get('example.com', null, null, function(xhr) {
        xhr.upload.onprogress = function(e) {
            // Upload in progress
        };
     })
     .then(function(xhr, response) {
        // Blah blah blah
     });
```

Handling fallbacks
------------------

XHR2 is not available on every browser, so, if needed, you can simply verify the XHR version with :

```js
if(qwest.xhr2) {
    // Actions for XHR2
}
else {
    // Actions for XHR1
}
```

Receiving binary data in older browsers
---------------------------------------

Getting binary data in legacy browsers needs a trick, as we can read it on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Receiving_binary_data_in_older_browsers). In qwest, that's how we could handle it :

```js
qwest.get('example.com/file', null, null, function(xhr) {
        xhr.overrideMimeType('text\/plain; charset=x-user-defined');
     })
     .then(function(response) {
         // response is now a binary string
     });
```

Compatibility notes
-------------------

According to this [compatibility table](https://kangax.github.io/compat-table/es5), IE7/8 do not support using `catch` and `delete` as method name because these are reserved words. If you want to support those browsers you should write :

```js
qwest.delete('example.com')
     .then(function(){})
     .catch(function(){});
```

Like this :

```js
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

- Blackberry 10.2.0 (and maybe others) can [log an error saying json is not supported](https://github.com/pyrsmk/qwest/issues/94) : set `responseType` to `auto` to avoid the issue
- the `catch` handler will be executed for status codes different from `2xx`; if no data has been received when `catch` is called, `response` will be `null`
- `auto` mode is only supported for `xml`, `json` and `text` response types; for `arraybuffer`, `blob` and `document` you'll need to define explicitly the `responseType` option
- if the response of your request doesn't return a valid (and recognized) `Content-Type` header, then you __must__ explicitly set the `responseType` option
- the default `Content-Type` header for a `POST` request is `application/x-www-form-urlencoded`, for `post` and `xhr2` data types
- if you want to set or get raw data, set `dataType` option to `text`
- as stated on [StackOverflow](https://stackoverflow.com/questions/8464262/access-is-denied-error-on-xdomainrequest), XDomainRequest forbid HTTPS requests from HTTP scheme and vice versa
- XDomainRequest only supports `GET` and `POST` methods

License
-------

[MIT license](http://dreamysource.mit-license.org) everywhere!
