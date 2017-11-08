'use strict';

const Proquest = require('./PromiseRequest.js');

class Netatmo {
  
  static connect() {
    return Proquest.req({
      uri: 'https://api.netatmo.com/oauth2/token',
      form: { 
        client_id: '*****************',
        client_secret: '*****************',
        grant_type: 'password',
        username: '*****************',
        password: '*****************',
        scope: 'read_station'
      },
      method: 'POST'
    });  
  }
  
  static readStation(token) {
    
    return Proquest.req({
      uri: 'https://api.netatmo.com/api/getstationsdata',
      form: { 
        access_token: token
      },
      method: 'POST'
    });  
    
  }
  
  static getData() {
    return new Promise(function(resolve, reject){
      
      Netatmo.connect()
      .then(function(body){
        const access_token = JSON.parse(body).access_token;
        return Netatmo.readStation(access_token);
      })
      .then(function(body){
        resolve(JSON.parse(body));
      })
      .catch(function(err){
        reject(err);
      });
      
    });
  }
}

module.exports = Netatmo;
