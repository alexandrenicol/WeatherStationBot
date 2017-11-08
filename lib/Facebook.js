'use strict';

const Proquest = require('./PromiseRequest.js');
const Apiai = require('./apiai.js');
const Netatmo = require('./Netatmo.js');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class Facebook {
  
  static receivedMessage(event) {
    var senderID = event.sender.id;
    var message = event.message;
    var messageText = message.text;
    if (messageText) {
      // -repeat bot- Facebook.sendTextMessage(senderID, `you said: ${messageText}`);
      
      Apiai.nlu(messageText, senderID)
      .then(function(body){
        if (body.result.source === 'domains') {
          Facebook.sendTextMessage(senderID, body.result.fulfillment.speech);
        } else if (body.result.source === 'agent') {
          
          const action = body.result.action;
          const result = body.result;
          
          switch(action){
            case 'needwhere':
              Facebook.sendQuickReply(senderID, body.result.fulfillment.speech, body.result.fulfillment.messages[1].replies);
              break;
            case 'humidity':
              
              Netatmo.getData()
              .then(function(data){
                
                let value = null;
                if (Apiai.getLocation(result) === 'indoor') {
                  value = data.body.devices[0].dashboard_data.Humidity;
                } else {
                  value = data.body.devices[0].modules[0].dashboard_data.Humidity;
                };
                
                Facebook.sendTextMessage(senderID, `The Humidity is ${value}% `);
              }).catch(function(err){
                Facebook.sendTextMessage(senderID, `Hum, something is wrong with Netatmo :/ `);
              });
              break;
            case 'temperature':
              
              
              
              Netatmo.getData()
              .then(function(data){
                
                let value = null;
                
                if (Apiai.getLocation(result) === 'indoor') {
                  value = data.body.devices[0].dashboard_data.Temperature;
                } else {
                  value = data.body.devices[0].modules[0].dashboard_data.Temperature;
                };
                
                Facebook.sendTextMessage(senderID, `The temperature is ${value}ºC `);
              }).catch(function(err){
                Facebook.sendTextMessage(senderID, `Hum, something is wrong with Netatmo :/ `);
              });
              break;
            default:
              Facebook.sendTextMessage(senderID, `We'll do that later :) `);
              break;
          }
          
        } 
        else {
          Facebook.sendTextMessage(senderID, `We'll do that later :) `);
        }
      }).catch(function(err){
        Facebook.sendTextMessage(senderID, `Hum, I'm not sure I understand that :/ `);
      });
      
    }
  }

  static sendQuickReply(recipientId, text, replies) {
    const messageData = {
      recipient: {             
        id: recipientId             
      },                       
      message: {               
        text: text, 
        metadata: 'needwhere',
        quick_replies: []
      }
    };
    
    for (let reply of replies){
      messageData.message.quick_replies.push({
        content_type: 'text',
        title: reply.capitalize(),
        payload: reply
      })
    }
    Facebook.sendTypingOff(recipientId);
    Facebook.callSendAPI(messageData);
  }
  
  static sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };
    Facebook.sendTypingOff(recipientId);
    Facebook.callSendAPI(messageData);
  }
  
  static sendTypingOn(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'typing_on'
    };

    Facebook.callSendAPI(messageData);
  }
  
  static sendTypingOff(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'typing_off'
    };

    Facebook.callSendAPI(messageData);
  }

  static callSendAPI(messageData) {
    Proquest.req({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: '*********************************************' },
      method: 'POST',
      json: messageData

    }).then( function (body) {
      
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    })
    .catch(function(err){
      console.error("Unable to send message.");
      console.error(err);
    });  
  }
  
}


module.exports = Facebook;
