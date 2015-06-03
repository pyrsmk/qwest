import {qwest} from './qwest.js';

let q = new qwest();

q.$httpGet('https://developer.mozilla.org/en-US/search.json?page=2').then(function (r) {
  console.log('response', r);
}).catch(function () {
  console.log('something went wrong');
});
