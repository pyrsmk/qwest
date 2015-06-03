import {qwest} from './qwest.js';

let q = new qwest();


q.get('https://developer.mozilla.org/en-US/search.json?page=2').then(function (r) {
  console.log('response', r);
}).catch(function () {
  console.log('something went wrong');
});
