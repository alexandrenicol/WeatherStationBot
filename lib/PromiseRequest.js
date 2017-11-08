'use strict';

const request = require('request');

class Proquest {
  static req (options) {
    return new Promise(function(resolve, reject){
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject({error: error, response: response});
        }
      });
    });
  }
}

module.exports = Proquest;
