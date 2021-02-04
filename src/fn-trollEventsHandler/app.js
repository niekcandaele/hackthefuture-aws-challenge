
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const comprehend = new AWS.Comprehend();

exports.lambdaHandler = async (event) => {
    try {
        // Log incoming event and environment variables
        console.log(event)
        console.log("Variable 'UserPreferencesTable': " + process.env.UserPreferencesTable)
        console.log("Variable 'MSTeamsSQSUrl': " + process.env.MSTeamsSQSUrl)
        console.log("Variable 'SlackSQSArn': " + process.env.SlackSQSUrl)
        console.log("Variable 'DiscordSQSUrl': " + process.env.DiscordSQSUrl)
        console.log("Variable 'TwilioSQSUrl': " + process.env.TwilioSQSUrl)

        // STEP 1: Amazon Comprehend => AI Sentiment analysis to retrieve severity
        var sentiment = await detectSentiment(event.detail.text, 'en')
        console.log("Message sentiment: " + sentiment)


        /*
        
        {
  Sentiment: 'NEUTRAL',
  SentimentScore: {
    Positive: 0.049908217042684555,
    Negative: 0.13539868593215942,
    Neutral: 0.8137410283088684,
    Mixed: 0.000952072034124285
  }
}
        */

        // STEP 2: DynamoDB => Retrieve list of subscribed profiles to sensitive-types

        // STEP 3: For each subscriber route to channel sqs
        const urls = [process.env.SlackSQSUrl, process.env.DiscordSQSUrl];
        for (const url of urls) {
            const params = {
                // Remove DelaySeconds parameter and value for FIFO queues
                DelaySeconds: 10,
                MessageAttributes: {
                    "Title": {
                        DataType: "String",
                        StringValue: "Troll alert"
                    },
                    "Author": {
                        DataType: "String",
                        StringValue: "Reddit"
                    },
                },
                MessageBody: JSON.stringify({ sentiment, event }),
                // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
                // MessageGroupId: "Group1",  // Required for FIFO queues
                QueueUrl: url
            };

            console.log('-*--------------------------');
            console.log(params);
            await sqs.sendMessage(params).promise()
        }


        return "succesfully finished"
    } catch (err) {
        console.log(err);
        throw err
    }
};

async function detectSentiment(text, language) {

    var params = {
        LanguageCode: language,
        Text: text
    };

    var sentimentAnalysis = await comprehend.detectSentiment(params).promise()
    console.log(sentimentAnalysis)
    return sentimentAnalysis.Sentiment

}