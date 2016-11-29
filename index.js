var Twit = require('twit');
var moment = require('moment');
var json2csv = require('json2csv');
var config = require('./config');
var utils = require('./utils');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');

var fields = ['id', 'screen_name', 'name', 'lang', 'searched_keyword' 'creation_date', 'followers', 'following', 'has_not_changed_background', 'has_not_changed_profile_image', 'bio', 'image_url', 'last_tweet_time', 'statues_count', 'geo_enabled', 'location', 'time_zone', 'favourites_count', 'verified', 'protected'];
var csv;
var userList = [];

var aviodWordsInName = ["inc", "co", "llp", "lllp", "llc", "pllc", "lab", "labs", "corp", "ltd", "gmbh", "dba", "lc", "company", "pc", "p\.c\."];

var createRegex = function(noWords) {
  var regexArray = [];
  for (var i =0; i<noWords.length; i++) {
    regexArray.push(new RegExp('\\b' + noWords[i] + '\\b', 'gi'));
  }
  return regexArray;
}(aviodWordsInName);



var followersLimit = function(numOfFollowers) {
  if (numOfFollowers > 100 && numOfFollowers <1000) {
    return numOfFollowers;
  }
  return false;
};

var sanitizeName = function(userName, noWords) {
  var words = userName.split(' ');
  if (words.length > 1 && words.length <= 3) {
    for (var i=0; i<noWords.length; i++) {
      if(userName.match(noWords[i])) {
        break;
      }
    }
    return true;
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

var formatDate = function(dates) {
  return _.map(dates, function(date) {
    return moment(date).format("lll");
  }); 
}

var getIdFromTweets = function(tweetList) {
  var listOfUserIds = [];
  for (var i = 0; i < tweetList.statuses.length; i++){
    listOfUserIds.push(tweetList.statuses[i].user.id);
  }
  return listOfUserIds;
}

var isTweetsAlmostEveryday = function(tweetDates) {
  var differenceInDays = _.difference(utils.fithteenDaysBeforeArray(), utils.formatTweetDates(tweetDates));
  return differenceInDays.length <= 2 ? true : false;
}

var isEngligsh(userLang) {
  if (userLang === "en") {
    return true;
  }
  return false;
}


//B: RETURN FILTERED TWITTER USER OBJECT 
var filterUsers = function(listOfUsers, tweetDates) {
  var userObj = {};
  if (listOfUsers) {
    for (var i= 0; i <listOfUsers.length; i++) {
      var userName = sanitizeName(listOfUsers[i].name);
      var userLang = isEngligsh(listOfUsers[i].lang);

      if(userName && userLang){ 
        console.log("GETTING list of users")
        userObj.id = (listOfUsers[i].id).toString();
        userObj.screen_name = listOfUsers[i].screen_name;
        userObj.name = listOfUsers[i].name;
        userObj.lang = listOfUsers[i].lang;
        userObj.searched_keyword = "MBTI";
        userObj.creation_date = listOfUsers[i].created_at;
        userObj.followers = listOfUsers[i].followers_count;
        userObj.following = listOfUsers[i].friends_count;
        userObj.has_not_changed_background = listOfUsers[i].default_profile;
        userObj.has_not_changed_profile_image = listOfUsers[i].default_profile_image;
        userObj.bio = listOfUsers[i].description;
        userObj.image_url = listOfUsers[i].profile_image_url;
        userObj.last_tweet_time = listOfUsers[i].status.created_at;
        userObj.statues_count = listOfUsers[i].statues_count;
        // userObj.tweets = formatDate(tweetDates);
        userObj.geo_enabled = listOfUsers[i].geo_enabled;
        userObj.location = listOfUsers[i].location;
        userObj.time_zone = listOfUsers[i].time_zone;
        userObj.favourites_count = listOfUsers[i].favourites_count;
        userObj.verified = listOfUsers[i].verified;
        userObj.protected = listOfUsers[i].protected;
      }    
    }
  }
  // console.log(userObj);
  return userObj;
}
//E: RETURN FILTERED TWITTER USER OBJECT



//B: DISPLAY LIMIT STATUS
T.get('application/rate_limit_status')
  .catch(function(err) {
    console.log("limit_rate_error: ", err.stack)
  })
  .then(function(result) {
    console.log("SEARCH_TWEETS_LIMIT: ",  JSON.stringify(result.data.resources.search));
    console.log("STATUSES_USER_TIMELINE: ",JSON.stringify(result.data.resources.statuses['/statuses/user_timeline']));
  });
//E: DISPLAY LIMIT STATUS

//B: GET TWEETS, FIND USER, FILTER
T.get('search/tweets', tweetsParams) // Gett all tweets that has a specific key words
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function(result) {
    var userIds = getIdFromTweets(result.data); // Get list of usersIds
    return userIds;
  })
  .then(function (res) {
    // console.log("is result passed: ", res);
    for(var i = 0; i<res.length; i++) {
      // console.log("user_id: ", res[i]); 
      var timelineParams = {
        user_id: res[i],
        count: 85
      };
      T.get('statuses/user_timeline', timelineParams)
        .catch(function (err) {
          console.log('caught error', err.stack)
        })
        .then (function(result) {        
          var currentUserInfo = result.data[0].user;

          var tweetDates = [];
          for (var i = 0; i<result.data.length; i++) {
            tweetDates.push(result.data[i].created_at);
          }
          var filteredUsers = filterUsers([currentUserInfo], tweetDates);
          if(filteredUsers.hasOwnProperty('id')) {
            userList.push(filteredUsers);
          }
        })
    }
  });
//B: GET TWEETS, FIND USER, FILTER  
   
//B: SAVE TO CSV FILE
setTimeout(function(){ 
  // console.log("USER_LIST2", userList);
  csv = json2csv({data: userList, fields:fields});
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}, 10000);
//E: SAVE TO CSV FILE











