qwest 0.3.3
===========

Qwest is a simple ajax library based on `promises` behaviour and that supports `XmlHttpRequest2` special data like `ArrayBuffer`, `Blob`, `Document` and `FormData`.

Syntax
------

```javascript
qwest.<method>(<url>,[data],[options],[before])
     .success(function(response){
        // Runned when the request is successful
     })
     .error(function(message){
        // Process error message
     });
     .complete(function(){
        // Always runned
     });
```

The method is either `get` or `post`. There's no `put` or `delete` support because the `XmlHttpRequest` object does not support data sending with those methods.

The `data` parameter is an object that list data to send.

The available `options` are :

- type : either [XHR2 supported types](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties), text, html, json (by default), js or xml; used to have automatic parsing of the response and a valid `Accept` header
- cache : true or false (default); used to disable browser caching
- async : true (default) or false; used to make asynchronous or synchronous requests
- user : the user to access to the URL, if needed
- password : the password to access to the URL, if needed

The `before` option lets you specify a callback to modify the `XHR` object before the request occurs.

Examples
--------

Send a simple GET request :

```javascript
qwest.get('example.com')
     .success(function(response){
        alert(response);
     });
```

Send a synchronous POST request with data :

```javascript
qwest.post('example.com',{foo:'bar'},{async:false})
     .success(function(response){
        // Make some useful actions
     })
     .error(function(message){
        log(message);
     });
```

As seen, qwest methods are chainable and you can specify multiple `success`, `error` or `complete` callbacks :

```javascript
qwest.post('example.com',{foo:'bar'})
     .success(function(response){
        // Make some useful actions
     })
     .success(function(response){
        // And other actions
     })
     .error(function(message){
        // Log here
     })
     .error(function(message){
        // Maybe here
     })
     .error(function(message){
        // Or here
     })
     .complete(function(message){
        // Finally, execute that
     });
```

In each callback, the `this` keyword is the `XmlHttpRequest` object, so you can do some specific tasks you may need.

```javascript
qwest.get('example.com')
     .success(function(response){
        // Blah blah blah
     })
     .error(function(message){
        log(this.responseText);
        throw message;
     });
```

To apply some manual options to the `XHR` object, define a `before` callback :

```javascript
qwest.get('example.com',{},{},function(){
        this.setRequestHeader('Accept-Encoding','gzip, deflate');
        this.uploadonprogress=function(e){
            // Upload in progress
        };
     })
     .success(function(response){
        // Blah blah blah
     });
```

Some notes
----------

- won't accept arrays or objects with different levels as `data` parameter, to define an array please set value's name to "foo[]" like in HTML
- default "Content-Type" header is "application/x-www-form-urlencoded" for basic `data`

License
-------

MIT license everywhere!
