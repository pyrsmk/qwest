'use strict';

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
  }

  /**
   *
   * @param method
   * @param url
   * @param args
   * @returns {Promise}
   */

  createRequest (method, url, args) {
    let that = this;
    let promise = new Promise(function (resolve, reject) {
      let client = that._Utils.getXHR();
      let uri = url;

      if(that._Utils.isXHR2()) {
        console.warn('qwest dont have support for IE - yet');
        return false;
      }

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
          resolve(that._Utils.preprocessResponse(this));
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

  /**
   *
   * @param url
   * @param args
   * @returns {Promise}
   */

  get(url, args) {
    if (url) {
      return this.createRequest('GET', url, args);
    } else {
      throw new Error('qwest :: GET :: missing URL');
    }
  }

  /**
   *
   * @param url
   * @param args
   * @returns {Promise}
   */

  post (url, args) {
    if(url && args) {
      return this.createRequest('POST', url, args);
    } else {
      throw new Error('qwest :: POST :: missing URL or Arguments');
    }
  }

  /**
   *
   * @param url
   * @param args
   * @returns {Promise}
   */

  delete (url,args) {
    if(url && args) {
      return this.createRequest('DELETE', url, args);
    } else {
      throw new Error('qwest :: DELETE :: missing URL or Arguments');
    }
  }
}

export {qwest}
