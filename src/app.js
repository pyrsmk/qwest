import {qwest} from './qwest.js';

let q = new qwest();

let mockApi = {
  get: 'http://127.0.0.1:8000/api/users'
};


window.q = q;

window.testss = 1;

q.get(mockApi.get, null, 'json').then(function (r) {
  console.log('response', r);
}).catch(function () {
  console.log('something went wrong');
});

/*
window.testt = 1;
var x = new Promise(function (resolve, reject) {
  var y = new Promise(function (resolve,reject) {
    var check = function () {
      if(window.testt === 2) {
        resolve('resolve y');
      } else {
        requestAnimationFrame(check);
      }
    };

    check();
  });

  y.then(function (e) {
    console.log(e);
    resolve('siemano x');
  });
});

x.then(function (e) {
  console.log(e);
});
*/
