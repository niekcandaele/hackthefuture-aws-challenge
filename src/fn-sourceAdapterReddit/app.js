/*

* https://www.reddit.com/prefs/apps
* https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example
* https://not-an-aardvark.github.io/snoowrap/Subreddit.html#getNew__anchor

*/

const { Subreddit } = require('snoowrap');
const snoo = require('snoowrap');
const AWS = require('aws-sdk')

exports.lambdaHandler = async (event) => {

    console.log(event);
    const r = new snoo({
        userAgent: 'hack-the-future',
        clientId: 'redacted',
        clientSecret: 'redacted',
        refreshToken: 'redacted'
    });

    const subreddit = await r.getSubreddit('worldnews');
    const topPosts = await subreddit.getTop({ time: 'hour', limit: 5 })

    let data = [];

    topPosts.forEach((post) => {
        data.push({
            link: post.url,
            text: post.title,
            score: post.score
        });
    });

    const eventBridge = new AWS.EventBridge({ region: 'eu-central-1', apiVersion: '2015-10-07' });



    /* ATTENTION DO NOT MAP the topPOSTS array --> something goes wrong with the cloning */
    const entries = []
    data.forEach(_ => {
        entries.push({
            Detail: JSON.stringify(_),
            DetailType: 'trollAlert',
            EventBusName: 'eventbusname',
            Source: 'be.i8c.htf.trollevents.reddit',
            Resources: [],
            Time: _.created_utc
        });
    });

    console.log(entries);

    await eventBridge.putEvents({
        Entries: entries
    }).promise()

    return "ok";
};
