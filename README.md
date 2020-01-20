# Yukine twitter bot

## Config vars setup
* To get your config variables, you'll need to create an app on [the twitter dev page](https://developer.twitter.com/) and retrieve your config variables from there.
* You will need to either add them in `config.js`, or use them in Heroku.

## Usage
* The bot will process and upload a random image from the `images` folder, with a status message, at every interval (set in milliseconds).

## Hosting
* If you choose to host on Heroku, your dyno will be restarted at least once every day ([see *Automatic dyno restarts*](https://devcenter.heroku.com/articles/dynos#restarting)).