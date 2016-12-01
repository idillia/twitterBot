var Twit = require('twit');
var moment = require('moment');
var json2csv = require('json2csv');
var config = require('./config');
var utils = require('./utils');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');
// var mbti_users = require("./mbti_users");
var infj_users = require("./infj_users");
// console.log("Length of Data", mbti_users.mbti_users.length);



var fields = ['id', 'screen_name', 'name', 'lang', 'searched_keyword', 'creation_date', 'followers', 'following', 'has_not_changed_background', 'has_not_changed_profile_image', 'bio', 'image_url', 'last_tweet_time', 'statues_count', 'geo_enabled', 'location', 'time_zone', 'favourites_count', 'verified', 'protected'];
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
    // for (var i=0; i<noWords.length; i++) {
    //   if(userName.match(noWords[i])) {
    //     break;
    //   }
    // }
    return true;
  }
  return false;
};

var created3MonthMore = function(account_creation_date) {
  var threeMonthsInMilis = 2764800000*3; //  milliseconds
  var date_created = moment(account_creation_date);
  var current_time = moment();
  var difference = current_time - date_created;
  return difference > threeMonthsInMilis ? true : false;
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

var isEngligsh = function(userLang) {
  if (userLang === "en") {
    return true;
  }
  return false;
}


var isInUSTimeZone = function(userTimeZone) {
  var timeZonesArray = ["Eastern Time (US & Canada)","Mountain Time (US & Canada)", "Pacific Time (US & Canada)", "Central Time (US & Canada)", ""];
  for (var i=0; i<timeZonesArray.length; i++) {
    if (userTimeZone == timeZonesArray[i]) {
      return true;
    }
  }
  return false;
}

var minFollowerAndFolloing = function(followers_count, following_count) {
  return  (followers_count >=50 && following_count >=50) ? true : false;
}

var isTweetedWithin30Days = function(last_tweet) {
  var oneMonthInMilis = 2764800000; //  milliseconds
  var date_tweeted = moment(last_tweet);
  var current_time = moment();
  var difference = current_time - date_tweeted;

  return difference < oneMonthInMilis ? true : false;
}

//B: RETURN FILTERED TWITTER USER OBJECT 
var filterUsers = function(listOfUsers) {

  if (listOfUsers) {

    for (var i= 0; i <listOfUsers.length; i++) {
      if(listOfUsers[i].status != undefined) {
        var userObj = {};
        console.log("#:", i,  "userName: ", listOfUsers[i].name,  ", language: ", listOfUsers[i].lang, ", time_zone: ", listOfUsers[i].time_zone, ", created_at:",  listOfUsers[i].created_at);
        var userName = sanitizeName(listOfUsers[i].name, createRegex);
        var userLang = isEngligsh(listOfUsers[i].lang);
        var userTZ = isInUSTimeZone(listOfUsers[i].time_zone);
        var user3MonthsMore = created3MonthMore(listOfUsers[i].created_at);
        var userFolCount = minFollowerAndFolloing(listOfUsers[i].followers_count, listOfUsers[i].friends_count);
        var userTweet30Days = isTweetedWithin30Days(listOfUsers[i].status.created_at);
        // console.log(listOfUsers[i]["screen_name"])
        // console.log(listOfUsers[i].status == undefined)
        console.log("Name: ", userName, ", Lang: ", userLang ,", TimeZone: ", userTZ , ", FollCount: ",  userFolCount , ", CreateMoreThan3Monts: " , user3MonthsMore , ", TweetedWithing30Days: ", userTweet30Days, !listOfUsers[i].default_profile)

        if(userName && userLang && userTZ && user3MonthsMore && !listOfUsers[i].default_profile && userFolCount && userTweet30Days){ 
          console.log("-----GETTING_USER #: ", i, "NAME: ", listOfUsers[i].name, "----")
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
          userObj.geo_enabled = listOfUsers[i].geo_enabled;
          userObj.location = listOfUsers[i].location;
          userObj.time_zone = listOfUsers[i].time_zone;
          userObj.favourites_count = listOfUsers[i].favourites_count;
          userObj.verified = listOfUsers[i].verified;
          userObj.protected = listOfUsers[i].protected;
        } 
      }  
    // console.log(userList);
      if(userObj !== {}) {
        userList.push(userObj);
      }
    }
  }
  // console.log(userObj);
  // console.log("userList is ", userList)
  return userObj;
}
//E: RETURN FILTERED TWITTER USER OBJECT



//B: DISPLAY LIMIT STATUS
T.get('application/rate_limit_status')
  .catch(function(err) {
    console.log("limit_rate_error: ", err.stack)
  })
  .then(function(result) {
    console.log("USERS-LOOKUP: ",  JSON.stringify(result.data.resources.users["/users/lookup"]));
    // console.log("STATUSES_USER_TIMELINE: ",JSON.stringify(result.data.resources.statuses['/statuses/user_timeline']));
  });
//E: DISPLAY LIMIT STATUS

var limitHundred = infj_users.infj_users.slice(4900,5000).join(', ');
// console.log(infj_users.infj_users);

var userLookUpParams = {
  screen_name: limitHundred
}


//B: GET TWEETS, FIND USER, FILTER

T.get('users/lookup', userLookUpParams)
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then (function(result) {     
    // console.log("currentUserInfo:", result.data);  
    filterUsers(result.data);
    // console.log("userlist", userList)
  })
//B: GET TWEETS, FIND USER, FILTER  
 
//B: SAVE TO CSV FILE
setTimeout(function(){ 
  // console.log("USER_LIST2", userList);
  csv = json2csv({data: userList, fields:fields});
  fs.writeFile('file.csv', csv, {'flags': 'a'}, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}, 5000);
//E: SAVE TO CSV FILE










