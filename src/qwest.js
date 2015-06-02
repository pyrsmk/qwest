/**
 * qwest 2.0.0
 *
 * @description
 * @returns {object}
 */

class qwest {
  constructor (options) {
    this.options = options;
  }

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
}

export {qwest}
