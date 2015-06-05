import {qwest} from './qwest.js';

let q = new qwest();

let mockApi = {
  get: 'http://127.0.0.1:8000/api/users'
};


window.q = q;

/**
 *
 *
 */

q.get(mockApi.get, null, 'json').then(function (r) {
  console.log('response', r);
}).catch(function () {
  console.log('something went wrong');
});

/**
 *
 *
 */

q.post(mockApi.get, {
  something: 'something'
},'json').then(function (r) {
  console.log('response',r);
}).catch(function (e) {
  console.log('something went wrong', e);
});

/**
 *
 *
 */

q.delete(mockApi.get, {
  del: 'me'
}, 'json').then(function (r) {
  console.log('response',r);
}).catch(function (e) {
  console.log('something went wrong',e);
});

