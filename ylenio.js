var Twit = require('twit');
var moment = require('moment');
var json2csv = require('json2csv');
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');



// var ylenio_tweeted_goodco = require("./json/ylenio_tweeted_goodco");
var ylenio_tweeted_goodco = require("./json/goodco_random_users1");


console.log("LENGTH: ", ylenio_tweeted_goodco.length);



var fields = ['id', 'screen_name', 'name', 'followers', 'account_creation_date', 'image_url', 'tweets', 'wordCount'];
var csv;
var userList = [];

var followersLimit = function(numOfFollowers) {
  if (numOfFollowers > 100 && numOfFollowers <1000) {
    return numOfFollowers;
  }
  return false;
};

var splitName = function(userName) {
  if (userName.split(' ').length > 1) {
    return userName;
  }
  return false;
};

var created6MonthMore = function(account_creation_date) {
  var sixMonthsInMilis = 1*60*24*32*6*60000; // 16588800000 milliseconds
  var date_created = moment(account_creation_date);
  var current_time = moment();
  var difference = current_time - date_created;
  return difference > sixMonthsInMilis ? true : false;
} 

// var formatDate = function(dates) {
//   return _.map(dates, function(date) {
//     return moment(date).format("lll");
//   }); 
// }

var getIdFromTweets = function(tweetList) {
  var listOfUserIds = [];
  for (var i = 0; i < tweetList.statuses.length; i++){
    listOfUserIds.push(tweetList.statuses[i].user.id);
  }
  return listOfUserIds;
}


var moreThan300Words = function(tweets) {
  var countWords = 0;
    for (var prop in tweets) {
      countWords += tweets[prop].split(" ").length;
    // console.log("WC: ", countWords)
    }
  return (countWords >=301) ? countWords : false;
}

// var isTweetsAlmostEveryday = function(tweetDates) {
//   var differenceInDays = _.difference(utils.fithteenDaysBeforeArray(), utils.formatTweetDates(tweetDates));
//   return differenceInDays.length <= 2 ? true : false;
// }



//B: RETURN FILTERED TWITTER USER OBJECT 
var filterUsers = function(listOfUsers, tweetDates) {
  // console.log("obj", tweetDates)

  var userObj = {};
  if (listOfUsers) {
      var userName = splitName(listOfUsers.name);
      var folowersCount = followersLimit(listOfUsers.followers_count);
      var creationDate = created6MonthMore(listOfUsers.created_at);
      var profileImageUrl = listOfUsers.profile_image_url;
      var profileImageUrlHttps = listOfUsers.profile_image_url_https;
      var profileBackgroundImageUrl = listOfUsers.profile_background_image_url;
      var profileBAckgroundImageUrlHttps = listOfUsers.profile_background_image_url_https;
      var profileBannerUrl = listOfUsers.profile_banner_url;
      var moreThan300 = moreThan300Words(tweetDates);
      console.log("screen_name: ", listOfUsers.screen_name, "word count", moreThan300)

      if(moreThan300){ 
        console.log("Saving list of users")
        userObj.id = (listOfUsers.id).toString();
        userObj.screen_name = listOfUsers.screen_name;
        userObj.name = listOfUsers.name;
        userObj.followers = listOfUsers.followers_count;
        userObj.account_creation_date = listOfUsers.created_at;
        userObj.image_url = profileImageUrl;
        userObj.tweets = tweetDates;
        userObj.wordCount = moreThan300;
      }  
  }
  // console.log(userObj);
  return userObj;
}
//E: RETURN FILTERED TWITTER USER OBJECT



//B: GET TWEETS, FIND USER, FILTER




    for(var i = 0; i<260; i++) {
      var timelineParams = {
        screen_name: ylenio_tweeted_goodco[i],
        count: 80
      };
      T.get('statuses/user_timeline', timelineParams)
        .catch(function (err) {
          console.log('caught error', err.stack)
        })
        .then (function(result) {    
          // console.log("er", result.data)
          if(!(result.data.errors)) { 
            var currentUserInfo = result.data[0].user;

            var tweetDates = [];
            var obj = {};
            for (var i = 0; i<result.data.length; i++) {
              // console.log(result.data[i].text)
              var dataTime = result.data[i].created_at;

              tweetDates.push(obj[dataTime] = result.data[i].text);
            }
            var filteredUsers = filterUsers(currentUserInfo, obj);
            if(filteredUsers.hasOwnProperty('id')) {
              userList.push(filteredUsers);
            }
        } else {
          console.log("some error happend")
        }  
        })
    }


 //B: DISPLAY LIMIT STATUS



  T.get('application/rate_limit_status')
    .catch(function(err) {
      console.log("limit_rate_error: ", err.stack)
    })
    .then(function(result) {
      console.log("SEARCH_TWEETS_LIMIT: ",  JSON.stringify(result.data.resources.search));
      console.log("STATUSES_USER_TIMELINE: ",JSON.stringify(result.data.resources.statuses['/statuses/user_timeline']));
    });

// //B: GET TWEETS, FIND USER, FILTER  

//B: SAVE TO JSON FILE
setTimeout(function(){ 
  // console.log(userList)
  // csv = json2csv({data: userList, fields:fields});
  // fs.writeFile('./json/twitterUsersForYlenio.json', JSON.stringify(userList, null, ' '), 'utf8', function(err) {
  fs.writeFile('./json/twitterUsersForYlenio.json', JSON.stringify(userList, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    console.log('ylenio users are saved into twitterUsersForYlenio');
  });
}, 20000);
//E: SAVE TO JSON FILE





   
// //B: SAVE TO CSV FILE
// setTimeout(function(){ 
//   // console.log("USER_LIST2", userList);
//   csv = json2csv({data: userList, fields:fields});
//   fs.writeFile('twitterUsersForYlenio.csv', csv, function(err) {
//     if (err) throw err;
//     console.log('file saved');
//   });
// }, 10000);
// //E: SAVE TO CSV FILE













