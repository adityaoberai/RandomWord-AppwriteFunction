const { Vonage } = require('@vonage/server-sdk')
const axios = require('axios');

module.exports = async function (req, res) {
  if (
    !req.variables['VONAGE_API_KEY'] ||
    !req.variables['VONAGE_API_SECRET'] ||
    !req.variables['VONAGE_BRAND_NAME'] ||
    !req.variables['MY_PHONE_NUMBER']
  ) {
    console.log("Environment variables are not set. Function cannot use Vonage.");
    res.json({
      messageSent: "Random word not sent. Check console log for more details."
    });
  }

  let randomWord = await getRandomWord();

  const vonage = new Vonage({
    apiKey: req.variables['VONAGE_API_KEY'],
    apiSecret: req.variables['VONAGE_API_SECRET']
  })

  const textBody = 'Random word is ' + randomWord;
  const from = req.variables['VONAGE_BRAND_NAME'];
  const to = req.variables['MY_PHONE_NUMBER'];

  await vonage.sms.send({to, from, textBody})
    .then(response => { 
      console.log('Message sent successfully'); 
      console.log(response); 
      res.json({
        messageSent: "Random word sent. Check console logs for more details"
      }); 
    })
    .catch(err => { 
      console.log('There was an error sending the message.\n\n' + err); 
      res.json({ 
        messageSent: "Random word not sent. Check console log for more details." 
      }) 
    });  
};

async function getRandomWord() {
  return axios.get('https://random-word-api.herokuapp.com/word')
          .then(function (response) {
            console.log('Random word is: ' + response.data[0]);
            return response.data[0];
          });
}
