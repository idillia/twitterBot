var Twit = require('twit');
var moment = require('moment');
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');
var csv2json = require("csv2json");
var readyTweetUsers = require("./snap_path_users.json");
var fs = require('fs');

// fs.createReadStream('file.csv')
// .pipe(csv2json({
// }))
// .pipe(fs.createWriteStream('JSON.json'));


var screen_name = "@bridgeunion";
var url = "goodco.company/scrappymcgyver";
var today = moment().format('LLL');
// console.log(today);




// tweetStrenghCardWithMedia(readyTweetUsers);


function tweetStrenghCardWithMedia(users, i) {
  var screen_name;
  var url;

    screen_name = '' + users.users[i]['screen_name'];
    url = "http://goodco.company/" + screen_name;
   

    var filename = "images/snapshots/" + screen_name + ".png";
    var params = {
      encoding: 'base64'
    }
    var b64 = fs.readFileSync(filename, params);

    T.post('media/upload', {media_data: b64}, uploaded);
  
  
    function uploaded(err, data, response) {
      var id = data.media_id_string;
      var tweet = {
        status: screen_name + " Based on your personality, we crated a Strength Card for you " + url,
        media_ids: [id]
      }
    
      T.post('statuses/update', tweet, tweeted);

      function tweeted(err, data, response) {
        if (err) {
          console.log("OH NO some error, ", err)
        } else {
          console.log("Posted!")
        }
      }
    }
    userNum ++;
    console.log(userNum);
} 



var userNum = 0;
var maxNum = 3;
  

setInterval(function() { 
  if(userNum < maxNum) {
    // tweetStrenghCardTextOnly(readyTweetUsers, userNum)
    tweetStrenghCardWithMedia(readyTweetUsers, userNum)
  } else {
    console.log("exiting");
    clearInterval();
  }

}, 5000);

function tweetStrenghCardTextOnly(users, i) {
  
  var screen_name;
  var url;
  
    // for(var i = 0; i < 3; i++) {
      screen_name = '' + users.users[i]['screen_name'];
      url = "http://goodco.company/" + screen_name;
   

    var tweet = {
      status: screen_name + " Based on your personality, we crated a Strength Card for you " + url
    }
    console.log(screen_name, url, tweet);
    // T.post('statuses/update', tweet, tweeted);
    T.post('statuses/update', tweet, tweeted)
 
    function tweeted(err, data, response) {
      if (err) {
        console.log("OH NO some error, ", err)
      } else {
        console.log("Posted!")
      }
    }
  // }
  userNum ++;
  console.log(userNum);
}   



