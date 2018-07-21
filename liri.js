
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
const myKeys = require('./keys');
var request = require('request-promise');
var fs = require('fs');
let val = myKeys;
var spotify = new Spotify(val.spotify);
var client = new Twitter(val.twitter);

//console.log(client)
var userCommands = process.argv[2];
var input = process.argv[3];
switch (userCommands) {
    case "my-tweets":
        tweets(client)
        break;
    case "spotify-this-song":
        spot(spotify, input)
        break;
    case "movie-this":
        movies(input)
        break;
    case "do-what-it-says":
        whatItSays()
        break;
}
function tweets(client) {

    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                console.log(`
                \n----------------
                \n${tweets[i].created_at}
                \n${tweets[i].text}`);
            }
        }
    });



}
function spot(spotify, input) {
    if (input === null) { input = 'the sign ace of base'; }

    spotify
        .search({ type: 'track', query: input })
        .then(function (response) {

            var tracks = response.tracks.items[0];
            var artist = tracks.artists[0].name;
            var songName = tracks.name;
            var album = tracks.album.name;
            var preview = tracks.preview_url;
            if (response) {
                console.log("Artist: " + artist + "\n" + "Song Name: " + songName + "\n" + "Album: " + album + "\n" + "Preview Track: " + preview);

            }


        })
        .catch(function (err) {
            spot(spotify, "The Sign")
            console.log(err);
        });


}
function movies(input) {

    if (input == "") {
        input = "Mr. Nobody";
    }

    request({
        "method": "GET",
        "uri": `http://www.omdbapi.com/?t=${input}&apikey=fd8af78a`,
        "json": true,
        "headers": {
            "User-Agent": "My little demo app"
        }
    }).then(function (results) {
        console.log("Title:" + results.Title + "\n" + "Year:" + results.Year + "\n" + "IMDB rating:" + results.imdbRating + "\n" +
            "Rotten Tomatoes:" + results.Ratings[1].Value + "\n" + "Country:" + results.Country + "\n" +
            "Language:" + results.Language + "\n" + "Plot:" + results.Plot + "\n" + "Actors:" + results.Actors)
    });


}
function whatItSays() {

    var text = fs.readFileSync('random.txt', 'utf8');
    var sayVariables = text.split(",");
    spot(spotify, sayVariables[1]);


}