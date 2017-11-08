
'use strict';

const _ = require('lodash');
const Proquest = require('./PromiseRequest.js');

class Apiai {
  
  static nlu(query, sessionId) {
    return Proquest.req({
      uri: 'https://api.api.ai/v1/query?v=20150910',
      body: { 
        query: query,
        lang: 'en',
        sessionId: sessionId
      },
      headers: {  
        'content-type': 'application/json',
        authorization: 'Bearer ********************'
      },
      json: true,
      method: 'POST'
    });  
  }
  
  static getLocation(result){
    if (result.parameters.moduleLocation){ 
      return result.parameters.moduleLocation;
    } else {
      try {
        return _.find(result.contexts, {"name": "modulelocation"}).parameters.moduleLocation;
      } catch (err) {
        return 'indoor'; //Ergh
      };
    }
  }
  
}

module.exports = Apiai;
