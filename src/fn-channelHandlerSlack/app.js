"use strict";
const { IncomingWebhook } = require("@slack/webhook");

exports.lambdaHandler = async (event) => {
  const url = "https://hooks.slack.com/services/redacted:)";
  const webhook = new IncomingWebhook(url);
  console.log(event);
  const data = JSON.parse(event.Records[0].body);

  await webhook.send({
    text: `Sentiment: ${data.sentiment}. ${data.event.detail.text}`
  });
  return "ok";
};

