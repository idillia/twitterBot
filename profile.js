var _ = require('underscore');

var json = require("./snap_path_users.json");
var fs = require('fs');
var webshot = require('webshot');

var options = {
  renderDelay: 20000,
  screenSize: {
    width: 500,
    height: 485
  },
  shotSize: {
    width: 500,
    height: 485
  }
}
console.log("size: ", json.users.length)

var snapshot = function(users){
  var str;
  for (var j = 780; j < 800; j++) {
    console.log(users.users[j].screen_name)
    users.users[j].prof_snapshot = 'images/snapshots/' + users.users[j].screen_name + '.png';

    webshot('http://localhost:3000/screenshot/' + users.users[j].screen_name, 'images/' + users.users[j].screen_name + '.png', options, function(err) {
      // screenshot now saved to google.png
    });
  }
  return users;
}(json)



// fs.writeFile('snap_path_users.json', JSON.stringify(snapshot, null, ' '), 'utf8', function(err) {
//     if (err) throw err;
//     console.log('file saved');
// });

// got 600