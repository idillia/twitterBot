var Twit = require('twit');
var moment = require('moment');
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');
var csv2json = require("csv2json");
// var json = require("./JSON.json");
var fs = require('fs');

// fs.createReadStream('file.csv')
// .pipe(csv2json({
// }))
// .pipe(fs.createWriteStream('JSON.json'));

// var uniqueUserList = _.uniq(json, function(item, key, id){
//   return item.id;
// });
// console.log(uniqueUserList);



var screen_name = "@bridgeunion";
var url = "goodco.company/scrappymcgyver";
var today = moment().format('LLL');
// console.log(today);



tweetStrenghCard();


function tweetStrenghCard() {

    var filename = "scrappy.png";
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

  // var screen_name;
  // var url;
  
  // for(var i =0; i<users.length; i++) {
  //   screen_name = '@' + users['screen_name'];
  //   url = users['strength_card_url'];
  // }


  // var tweet = {
  //   status: screen_name + " Based on your INTJ personality, we crated a Strength Card for you " + url
  // }
  
  // // setInterval(..., 1000*60);

  // T.post('statuses/update', tweet, tweeted);

  // function tweeted(err, data, response) {
  //   if (err) {
  //     console.log("OH NO some error, ", err)
  //   } else {
  //     console.log("Posted!")
  //   }
  // }
}


