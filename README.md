# WeatherStationBot

![Image of the bot](https://s3-eu-west-1.amazonaws.com/static-webnicol/weathersttionbot.png)

## Weather station Facebook Messenger Bot 

### Requirementes
- api.ai account
- aws account (lambda and API gateway)
- netatmo account
- facebook account
- node + npm

### Installation
- clone the repository and enter the folder
- run 'npm install'
- upload the agent - Netatmo.zip - onto your api.ai account
- Change your keys in:
- - lib/apiai.js (Bearer Authorization)
- - lib/Facebook.js (access_token)
- - lib/Netatmo.js (client_id, client_secret, username and password)
- - lib/index.js (verify_token)
- Deploy the lambda on AWS

### Contact
- Twitter @nicol_alexandre

