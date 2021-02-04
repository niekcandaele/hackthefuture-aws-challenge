"use strict";
const Discord = require("discord.js");

exports.lambdaHandler = async (event) => {

  const webhookClient = new Discord.WebhookClient(
    process.env.DiscordID,
    process.env.DiscordToken
  );

  console.log(event);
  const data = JSON.parse(event.Records[0].body);

  const embed = new Discord.MessageEmbed()
    .setTitle(`${data.sentiment}: ${data.event.detail.text}`)
    .setColor("#0099ff")

  await webhookClient.send("", {
    username: "hack the future bot",
    avatarURL: "https://hackthefuture.be/assets/site/images/hero/hologram.png",
    embeds: [embed],
  });
  await webhookClient.destroy();
  return;
};

