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
  sendGet (url, options) {
    let that = this;
    return new Promise(function (resolve, reject) {
      let xhr = that._Utils.getXHR();

    });
  }
}

export {qwest}
