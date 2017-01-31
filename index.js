'use strict';


const Facebook = require('./lib/Facebook');




exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '500' : '200',
        body: err ? err.message : res,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'GET':
            if (event.path == '/NetatmoBot/check') {
                if (event.queryStringParameters['hub.verify_token'] === '*******************************') {
                  done(null, event.queryStringParameters['hub.challenge']);
                } else {
                  done(null, 'Error, wrong validation token');    
                }
            }
            break;
        case 'POST':
            if (event.path == '/NetatmoBot/check') {
                
                var data = JSON.parse(event.body);

                // Make sure this is a page subscription
                if (data.object === 'page') {
            
                    // Iterate over each entry - there may be multiple if batched
                    data.entry.forEach(function(entry) {
                
                      // Iterate over each messaging event
                      entry.messaging.forEach(function(event) {
                        if (event.message) {
                          Facebook.sendTypingOn(event.sender.id);
                          setTimeout(function(){ Facebook.receivedMessage(event); }, 1000);
                          
                        } else if (event.postback) {
                          if (event.postback.payload === 'get_started'){
                            Facebook.sendTextMessage(event.sender.id, `Welcome to the Weather station Bot`);
                          } else if (event.postback.payload === 'help'){
                            Facebook.sendTextMessage(event.sender.id, `You can ask for the current temperature or humidity, either for your indoor or outdoor module`);
                          } else {
                            console.log("Webhook received unknown event: ", event);
                          }
                          
                        } else {
                          console.log("Webhook received unknown event: ", event);
                        }
                      });
                    });
                
                    done(null, true);
                }
                
            }
            
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
