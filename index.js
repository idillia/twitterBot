var Twit = require('twit');
var moment = require('moment');
var json2csv = require('json2csv');
var config = require('./config');
var utils = require('./utils');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');




// var twitterHandlers = require("./json/twitterHandlers");
var twitterHandlers = require("./json/smallSet");

// STEP 3: Get twitter profiles, filter 

var fields = ['id', 'screen_name', 'name', 'lang', 'searched_keyword', 'creation_date', 'followers', 'following', 'has_not_changed_background', 'has_not_changed_profile_image', 'bio', 'image_url', 'last_tweet_time', 'statues_count', 'geo_enabled', 'location', 'time_zone', 'favourites_count', 'verified', 'protected' ];
var csv;
var userList = [];
var filteredList = [];


var followersLimit = function(numOfFollowers) {
  if (numOfFollowers > 100 && numOfFollowers <1000) {
    return numOfFollowers;
  }
  return false;
};

var sanitize = function(user, noWords) {
  if (user != undefined && user.length > 1) {
    var words = user.split(' ');
      for (var i=0; i<noWords.length; i++) {
        if(user.match(noWords[i])) {
            console.log("found bad word, return false")
          return false;
        }
      }
      return true;
    }
  return false;
};

var sanitizeName = function(user, noWords) {
  var words = user.split(' ');
  if (words.length > 1 && words.length < 4) {
    for (var i=0; i<noWords.length; i++) {
      if(user.match(noWords[i])) {
          console.log("found bad word, return false")
        return false;
      }
    }
    return true;
  }
  return false;
};


var cleanName = function(userName) {
  // console.log("before clearing: ", userName);
  userName = userName.replace(/[^a-z\d\s]+/gi, "");
  // console.log("after clearing: ", userName);
  return userName;
}



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

        // console.log("#:", i,  "userName: ", listOfUsers[i].name,  ", language: ", listOfUsers[i].lang, ", time_zone: ", listOfUsers[i].time_zone, ", created_at:",  listOfUsers[i].created_at);
        console.log("#:", i,  "userScreenName: ", listOfUsers[i].screen_name, userName , userBio ,userLang , userTZ,  user3MonthsMore ,!listOfUsers[i].default_profile ,userFolCount , userTweet30Days);
        var userName = sanitizeName(listOfUsers[i].name, utils.sanName);
        var userBio = sanitize(listOfUsers[i].description, utils.sanBio);
        var userLang = isEngligsh(listOfUsers[i].lang);
        var userTZ = isInUSTimeZone(listOfUsers[i].time_zone);
        var user3MonthsMore = created3MonthMore(listOfUsers[i].created_at);
        var userFolCount = minFollowerAndFolloing(listOfUsers[i].followers_count, listOfUsers[i].friends_count);
        var userTweet30Days = isTweetedWithin30Days(listOfUsers[i].status.created_at);
        // console.log("Name: ", userName, "Bio: ", userBio, ",Lang: ", userLang ,", TimeZone: ", userTZ , ", FollCount: ",  userFolCount , ", CreateMoreThan3Monts: " , user3MonthsMore , ", TweetedWithing30Days: ", userTweet30Days, !listOfUsers[i].default_profile)

        if(userName && userBio && userLang && userTZ && user3MonthsMore && !listOfUsers[i].default_profile && userFolCount && userTweet30Days){ 
          console.log("-----GETTING_USER #:", i, "userScreenName: ", listOfUsers[i].screen_name, "----")
          userObj.id = (listOfUsers[i].id).toString();
          userObj.screen_name = listOfUsers[i].screen_name;
          userObj.name = cleanName(listOfUsers[i].name);
          userObj.lang = listOfUsers[i].lang;
          userObj.searched_keyword = "INFJ";
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
      if(! _.isEmpty(userObj)) {
        filteredList.push(userObj);
      }
    }
  }
  fs.writeFile('./json/filltered_twitter_users.json', JSON.stringify(filteredList, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    console.log('filltered_twitter_users file saved');
  });
  return userObj;
}
//E: RETURN FILTERED TWITTER USER OBJECT


var min = 0;
var max = 0;
var interval;
var limitHundred;

interval = setInterval(function() {
  if(max < twitterHandlers.length) {
    console.log("CALLED")
    limitHundred = twitterHandlers.slice(min,max).join(', ');  
      min = max;
      max +=1; 
  } 
  else if((twitterHandlers.length- max + 1 ) < 10) {
    limitHundred = twitterHandlers.slice(min,twitterHandlers.length).join(', ');

    //B: SAVE TO JSON FILE
    fs.writeFile('./json/unfiltered_users.json', JSON.stringify(userList, null, ' '), 'utf8', function(err) {
      if (err) throw err;
      console.log('file saved');
      setTimeout(function(){
        var unfiltered = require('./json/unfiltered_users');
    
        console.log(unfiltered)
        filterUsers(unfiltered);
      },10000)
      
    });

    clearInterval(interval);
    //E: SAVE TO JSON FILE
  }
    
    console.log("handlers", min, '' ,max);

    var userLookUpParams = {
      screen_name: limitHundred
    }

    //B: GET TWEETS, FIND USER, FILTER

    T.get('users/lookup', userLookUpParams)
      .catch(function (err) {
        console.log('caught error', err.stack)
      })
      .then (function(result) {     
        if(result.data[0] != undefined) {
          userList.push(result.data[0]);
        }
      })
    //B: GET TWEETS, FIND USER, FILTER  

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
}, 1000);




 
// //B: SAVE TO CSV FILEsg
// setTimeout(function(){ 
//   // console.log("USER_LIST2", userList);
//   csv = json2csv({data: userList, fields:fields});
//   fs.writeFile('file.csv', csv, {'flags': 'a'}, function(err) {
//     if (err) throw err;
//     console.log('file saved');
//   });
// }, 5000);
// //E: SAVE TO CSV FILE











