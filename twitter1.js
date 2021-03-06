require ('dotenv').config();
const express = require('express');
const request = require('request');
const twitter = require('./api/twitter');

const app = express();

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const credentials = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
const base64Credentials = new Buffer(credentials).toString('base64');

app.get('/tweets', function(req, resp) {
	// console.log(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);

	if(!req.query.q) {
		resp.status(422).json({
			error: 'Please specify the "q" query string parameter'
		});
		return;
	}

	let q = req.query.q;

	twitter
		.post('https://api.twitter.com/oauth2/token', base64Credentials)
		.then(function(token) {
			// let token = JSON.parse(body).access_token;

			twitter
				.get(`https://api.twitter.com/1.1/search/tweets.json?q=${q}`, token)
				.then(function(tweets) {
					resp.json(tweets);
				});
		});
});


const port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log(`Listening on port ${port}`);
});