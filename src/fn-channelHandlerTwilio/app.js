const client = require('twilio')(process.env.TwilioAccountSID, process.env.TwilioAuthToken, { lazyLoading: true, logLevel: 'debug', region: '', edge: '' });

exports.lambdaHandler = async (event) => {
  console.log(event)

  const message = await client.messages.create({
    body: '',
    from: '',
    to: '',
  });
  //console.log('twilio': message);


  return "ok"
};
