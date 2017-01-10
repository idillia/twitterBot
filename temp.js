var _ = require('underscore');


var a = _.difference([1, 2, 3, 4, 5], [5, 2, 10, 8, 11, 7], [5,4,99,0]);
console.log(a);









// var str = 'http://localhost:3000/scrappymcgyver';
// var str1 = 'http://localhost:3000/scrappymcgyver/';
// re = '([^/]*)$';
// re1 = '([^/]*)/$';

// console.log("str ", str.match(re)[1]);
// console.log("str1 ", str1.match(re1)[1]);



//   var _ = require('underscore');

//   var screen_name = '', url = '';
  

//     function chooseRandomTweet(){
//       var rand;
//       var tweet = [
//         "Hi " + screen_name + ", based on your friends’ answers we have created a strength profile for you. Is this accurate? " + url,
//         "Hey " + screen_name + ", we have analyzed your twitter feed and created a psychometric profile for you. Is this correct? " + url,
//         "Hey " + screen_name + ", we created a personality profile for you. Does this really describe you? " + url,
//         "Hey " + screen_name + ", here is your hidden personality strength. Is this close to the truth? " + url
//       ]
//       rand = _.random(0, tweet.length);

//       console.log( tweet[rand]);
//     }



// chooseRandomTweet();






// var twitterHandlers = require("./json/twitterHandlers");

// var min = 0;
// var max = 100;
// var interval;
// var limitHundred;

// console.log(twitterHandlers.length);




//   interval = setInterval(function() {

//     if(max < twitterHandlers.length) {

//       limitHundred = twitterHandlers.slice(min,max).join(', ');
//       console.log(min," " ,max);

//       min = max;
//       max +=100; 
//     } else if((twitterHandlers.length- max + 100 ) <100) {
//       limitHundred = twitterHandlers.slice(min,twitterHandlers.length).join(', ');
//       console.log(min," " ,twitterHandlers.length);
//       clearInterval(interval);
//     }
//   }, 500);




// var aviodWordsInName = ["inc", "co", "llp", "lllp", "llc", "pllc", "lab", "labs", "corp", "ltd", "gmbh", "dba", "lc", "company", "pc", "p\.c\."];
// var aviodWordsInBio = ["adult only", "+18", "xxx", "erotica", "porn"];



// var bioData = "Have 18 porn books, podcast, an #ecom store & dropship fulfillment company, 30 info products. Also into travel, reading, dancing. INFJ. Don't check DM's. Say hi! :)";
// var nameData = "TO many co"

// var sanName = function(noWords) {
//   var regexArray = [];
//   for (var i =0; i<noWords.length; i++) {
//     regexArray.push(new RegExp('\\b' + noWords[i] + '\\b', 'gi'));
//   }
//   return regexArray;
// }(aviodWordsInName);

// var sanBio = function(noWords) {
//   var regexArray = [];
//   for (var i =0; i<noWords.length; i++) {
//     if (noWords[i] == "+18") {
//       regexArray.push(new RegExp('\\+18', 'gi'));
//     }
//     else {
//       regexArray.push(new RegExp('\\b' + noWords[i] + '\\b', 'gi'));
//     }
//   }
//   return regexArray;
// }(aviodWordsInBio);


// var sanitize = function(user, noWords) {
//   var words = user.split(' ');
//   if (words.length > 1) {
//     for (var i=0; i<noWords.length; i++) {
//       if(user.match(noWords[i])) {
//           console.log("found bad word, return false")
//         return false;
//       }
//     }
//     return true;
//   }
//   return false;
// };

// var sanitizeName = function(user, noWords) {
//   var words = user.split(' ');
//   if (words.length > 1 && words.length < 4) {
//     for (var i=0; i<noWords.length; i++) {
//       if(user.match(noWords[i])) {
//           console.log("found bad word, return false")
//         return false;
//       }
//     }
//     return true;
//   }
//   return false;
// };



// console.log(sanitizeName(nameData, sanName));
// // console.log(sanitize(bioData, sanBio));