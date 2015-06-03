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
   * preprocess response
   *
   */

  preprocessResponse (response) {

    return response;
  }
}

export {Utils}
