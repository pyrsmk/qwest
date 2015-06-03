/**
 *
 *
 */

class Utils {

  /**
   *
   *
   */

  constructor () {

  }

  /**
   * Get correct Ajax Object across browsers
   * @returns {XMLHttpRequest}
   */

  getXHR () {
    return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  }

  /**
   * Helper functions to check if XHR2
   * is supported
   * @returns {boolean}
   */

  isXHR2 () {
    return (this.getXHR().responseType !== '');
  }


  /**
   *
   * @param res
   * @returns {*}
   */

  preprocessResponse (res) {
    let data;

    if(this.isJSON(res)) {
      data = JSON.parse(res.response);
    }

    return data;
  }

  /**
   * Check if data is JSON
   * @param res
   * @returns {boolean}
   */

  isJSON (res) {
    return res.getAllResponseHeaders().toString().indexOf('json') !== -1;
  }
}

export {Utils}
