import {Utils} from './utils.js';

/**
 * qwest 2.0.0
 *
 * @description
 * @returns {object}
 */

class qwest {

  constructor (options) {
    this.options = options;
    this._Utils = new Utils();
    console.log(this._Utils.getXHR());
  }

  /**
   *
   * test will be removed
   */

  test () {
    let promise = new Promise(function(resolve, reject) {
      let num = Math.random() * 15;
      console.log(num);
      if (num < 10) {
        resolve("Stuff worked!");
      } else {
        reject(Error("It broke"));
      }
    });

    promise.then(function (result) {
      console.log(result);
    }, function (err) {
      console.log(err);
    });
  }

  /**
   *
   * @param url
   * @param options
   */

  createRequest (method, url, args) {
    let that = this;
    let promise = new Promise(function (resolve, reject) {
      let client = that._Utils.getXHR();
      let uri = url;

      /*if(that._Utils.isXHR2()) {
        console.warn('qwest dont have support for IE - yet');
        return false;
      }*/

      if (args && (method === 'POST') || method === 'PUT') {
        let argCount = 0;
        uri += '?';

        for(let key in args) {
          if(args.hasOwnProperty(key) && argCount++) {
            uri += '&';
          }

          /**
           * refactor to template string ?
           */
          uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
        }
      }

      client.onload = function () {
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(this.statusText);
        }
      };
      client.onerror = function () {
        reject(this.statusText);
      };

      client.open(method,uri);
      client.send(null);
    });

    return promise;
  }

  httpGet (url, args) {
    if (url) {
      return this.createRequest('GET', url, args);
    } else {
      throw 'qwest::missing url';
    }
  }
}

export {qwest}
