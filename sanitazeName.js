var _ = require('underscore');
var json = require("./fb_users.json");
var fs = require('fs');


var sanitizeName = function(userName) {
  var str;
  for (var j = 0; j< userName.users.length; j++) {
    console.log("before clearing: ", userName.users[j].name);
    userName.users[j].name = userName.users[j].name.replace(/[^a-z\d\s]+/gi, "");
    console.log("after clearing: ", userName.users[j].name);
  }
  return userName;
}(json);



fs.writeFile('json.json', JSON.stringify(sanitizeName, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    console.log('file saved');
});