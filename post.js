var Twit = require('twit');
var moment = require('moment');
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');
var csv2json = require("csv2json");
// var readyTweetUsers = require("./snap_path_users.json");
var fs = require('fs');

var file = './snap_path_users.json';
var readyTweetUsers = require(file);

// fs.createReadStream('file.csv')
// .pipe(csv2json({
// }))
// .pipe(fs.createWriteStream('JSON.json'));


var screen_name = "@bridgeunion";
var url = "goodco.company/scrappymcgyver";
var today = moment().format('LLL');
console.log(today);



setInterval(function() { 
  if(userNum < maxNum) {
    tweetStrenghCardTextOnly(readyTweetUsers, userNum)
    // tweetStrenghCardWithMedia(readyTweetUsers, userNum)
  } else {
    console.log("exiting");
    clearInterval();
  }

}, 0);


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

    readyTweetUsers.users[i].posted_time = today;
    readyTweetUsers.users[i].status_action = "PostedMedia"
    fs.writeFile(file, JSON.stringify(readyTweetUsers, null, 2), function (err) {
      if (err) return console.log(err);
    });
    userNum ++;
    console.log(userNum);
} 



var userNum = 100;
var maxNum = 200;
  


function tweetStrenghCardTextOnly(users, i) {
  
  var screen_name;
  var url;
  
      screen_name = '' + users.users[i]['screen_name'];
      url = "http://goodco.company/" + screen_name;
   

    var tweet = {
      status1: "Hi @" + screen_name + ", based on your friends’ answers we have created a strength profile for you. Is this accurate? " + url,
      status2: "Hey @" + screen_name + ", we have analyzed your twitter feed and created a psychometric profile for you. Is this correct? " + url,
      status3: "Hey @" + screen_name + ", we created a personality profile for you. Does this really describe you? " + url,
      status4: "Hey @" + screen_name + ", here are your hidden personality strength. Is this close to the truth? " + url

    }
    console.log(tweet.status1);
    console.log(tweet.status2);
    console.log(tweet.status3);
    console.log(tweet.status4);
  //   // T.post('statuses/update', tweet, tweeted);
  //   T.post('statuses/update', tweet, tweeted)
 
  //   function tweeted(err, data, response) {
  //     if (err) {
  //       console.log("OH NO some error, ", err)
  //     } else {
  //       console.log("Posted!")
  //     }
  //   }
    
    readyTweetUsers.users[i].posted_time = today;
    readyTweetUsers.users[i].status_action = "PostedTextOnly"
    fs.writeFile(file, JSON.stringify(readyTweetUsers, null, 2), function (err) {
      if (err) return console.log(err);
    });
  userNum ++;
  console.log(userNum);
}   

