sink('qwest',function(test,ok,before,after){

    test('Ender',2,function(){
        ok($($('img')[0]).listen,'Listen method registered');
        ok($.discover,'Discover method registered');
    });

});

start();
