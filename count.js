var json = require("./snap_path_users.json");

var textOnly = 0;
var media = 0;

for (var i = 0; i < json.users.length; i++) {
  if(json.users[i]["status_action"] == "PostedTextOnly") {
    textOnly++;
    console.log("textOnly", textOnly)
    console.log("textOnlyNames", json.users[i].screen_name);
  } else if(json.users[i]["status_action"] == "PostedMedia") {
    media++;
    console.log("media", media)
    console.log("MediaNames", json.users[i].screen_name);
  }
} 


    // 100 - 7  
    //718 - 57

    
