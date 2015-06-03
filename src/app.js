import {qwest} from './qwest.js';

let q = new qwest();

q.get('https://developer.mozilla.org/en-US/search.json?page=2').then(function (r) {
  console.log('respone', r);
}).then(function () {
  console.log('Hello world');
});
