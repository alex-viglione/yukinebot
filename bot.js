console.log('Hey I\'m here');

const Twit = require('twit');

const config = require('./config');
const T = new Twit(config);


setInterval(tweetIt, 1000*20);

function tweetIt() {

    const targets = ['the dummy', 'senpai', 'one of the two goblins', 'the green goblin in particular', 'everyone'];
    const randomTarget = Math.floor(Math.random() * targets.length);

    const tweet = {
        status: 'RoboChrisSay : I will now proceed to randomly yell at : ' + targets[randomTarget]
    };
    
    T.post('statuses/update', tweet, tweeted);
    testNumber++;
    
    function tweeted(err, data, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('It worked!');
        }
    };
};
