qwest 0.6.0
===========

Qwest is a simple ajax library based on `promises` behaviour and that supports `XmlHttpRequest2` special data like `ArrayBuffer`, `Blob`, `Document` and `FormData`.

That's new!
-----------

You don't need to write array's data name as 'foo[]' anymore, qwest will handle this for you. So, just do :

```javascript
// Old
qwest.get('someurl.com',{ 'foo[]' : [1,2,3,4] });
// New
qwest.get('someurl.com',{ foo : [1,2,3,4] });
```

Syntax
------

```javascript
qwest.<method>(<url>,[data],[options],[before])
     .success(function(response){
        // Run when the request is successful
     })
     .error(function(message){
        // Process error message
     });
     .complete(function(){
        // Always run
     });
```

The method is either `get` or `post`. There's no `put` or `delete` support because the `XmlHttpRequest` object does not support data sending with those methods.

The `data` parameter is an object that list data to send. It supports multi-dimensional arrays and objects.

The available `options` are :

- type : either [XHR2 supported types](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties), text, html, json (by default), js or xml; used to have automatic parsing of the response and a valid `Accept` header
- cache : true or false (default is `false` for GET requests and `true` for POST requests); used to disable browser caching using a query parameter `__t` with request timestamp
- async : true (default) or false; used to make asynchronous or synchronous requests
- user : the user to access to the URL, if needed
- password : the password to access to the URL, if needed

The `before` option lets you specify a callback to modify the `XHR` object before the request occurs.

You can also verify the XHR object version to handle fallbacks :

```javascript
if(qwest.xhr2){
    // Actions for XHR2
}
else{
    // Actions for XHR1
}
```

Requests limitation
-------------------

Requests limitation is a very powerful functionnality which avoids browser freezes and server overloads. It's really useful for freeing bandwidth and memory resources when you have a whole bunch of requests to do at the same time (when you load a gallery, per example). You just need to set the request limit and when the count is reached qwest will stock all further requests to start them when a slot is free.

```javascript
qwest.limit(4);

$$('.foo').each(function(){
    qwest.get(this.data('some_url_to_get'));
});
```

If you want to remove the limit, just do `qwest.limit(null)`.

Some examples
-------------

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

Please note that the default "Content-Type" header is "application/x-www-form-urlencoded". Overwrite it if you want ;)

License
-------

[MIT license](http://dreamysource.mit-license.org) everywhere!
