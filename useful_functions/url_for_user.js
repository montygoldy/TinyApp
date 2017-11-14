const urlDatabase = require("../database/urlDatabase");

module.exports = {

  // function for urls for user

  urlsForUser: function (id) {
    let userUrl = {};
    for (let url_Id in urlDatabase) {
      if (urlDatabase[url_Id].userId === id) {
        userUrl[url_Id] = urlDatabase[url_Id];
      }
    } return userUrl;
  }
}