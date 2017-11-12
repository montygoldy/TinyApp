const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 8080;


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));


app.use(cookieSession({
  name: 'session',
  keys: ["fff"]
}))

// URL database

const urlDatabase = {
 "b2xVn2": { longURL:"http://www.lighthouselabs.ca",
              userId: "userRandomID3"
              },
 "9sm5xK": { longURL: "http://www.google.com",
              userId: "userRandomID3"
              }
}

//User  database

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "userRandomID2": {
    id: "userRandomID2",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "userRandomID3": {
    id: "UserRandomID3",
    email: "montygoldy@gmail.com",
    password: "montygoldy"
  }
}

// function to generate random number

function generateRandomString(){
  return Math.random().toString(36).substring(2, 8);
}


// function for urls for user

function urlsForUser(id){
  let userUrl = {};
  for(let url_Id in urlDatabase){
    if(urlDatabase[url_Id].userId === id){
      userUrl[url_Id] = urlDatabase[url_Id];
    }
  } return userUrl;
}

// Rendering the default page to urls new page

app.get('/', (req, res) => {
    res.redirect('/register');
})

//Check to see the json render of the database

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

// Rendering all the urls

app.get("/urls", (req, res) => {
  if(req.session.user_id){
    let templateVars = { urls: urlsForUser(req.session.user_id),
                         user: req.session.user_id
                       };
    res.render("urls_index", templateVars);
  } else{
    res.status(401).send('Please Login/Register to view the content  <a class="nav-link js-scroll-trigger" href="/login">Login</a>');
  }
});

// Route for creating new url

app.get("/urls/new", (req, res) => {
  let templateVars = {user: req.session.user_id,
                      longURL: urlDatabase[req.params.id]}
  if(req.session.user_id){
    res.render("urls_new", templateVars);
  } else{
        res.status(401).send('Please Login/Register to view the content  <a class="nav-link js-scroll-trigger" href="/login">Login</a>');

  }
});

// Route to check the longurl of the shorturl

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id].longURL,
                       user: req.session.user_id

                     }
  res.render('urls_show', templateVars);
});

// To grab the orignal link of the shortURL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//Create url and redirect to 6 digit random url page

app.post("/urls", (req, res) => {
  const url = req.body;
  url.shortURL = generateRandomString();
  urlDatabase[url.shortURL] = {longURL: url.longURL,
                                userId: req.session.user_id
                              };
  res.redirect("urls/" + url.shortURL);
});

//Deleting links from the database

app.post("/urls/:id/delete", (req, res) => {
  if(req.session.user_id === urlDatabase[req.params.id].userId){
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else{
    res.status(403).send('You are not allowed to delete this. PLease login <a class="nav-link js-scroll-trigger" href="/login">Login</a>');
  }
});

//Editing links

app.post("/urls/:id", (req, res) => {
  if(req.session.user_id === urlDatabase[req.params.id].userId){
    shortURL = req.params.id;
    let url = req.body;
    urlDatabase[shortURL].longURL = url.longURL;
    res.redirect( shortURL);
  } else{
    res.status(401).send("You cannot edit other user links");
  }
});

// Login Route

app.post("/login", (req, res) => {
  let useremail = req.body.email;
  let userpassword = req.body.password;
  let found = false;

  for(let userId in users){
    if(useremail === users[userId].email && bcrypt.compareSync(userpassword, users[userId].password)){
      userid =  users[userId].id;
      found = true;
    }

  }



  if(found){
    req.session.user_id =  userid;
    res.redirect("/urls/new");
  } else{
    res.status(400).send('Email and password not matching!!! Try Again <a class="nav-link js-scroll-trigger" href="/login">Login</a>');
  }
});


app.get("/login", (req, res) => {
  let templateVars = {user: req.session.user_id}
  res.render("login", templateVars);
})


// Logout route

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls/new");
});

// Register new user

app.get("/register", (req, res) => {
  let templateVars = {user: req.session.user_id}
  res.render("register_user", templateVars);
})

app.post("/register", (req, res) => {
  let useremail = req.body.email;
  let userpassword = bcrypt.hashSync(req.body.password, 10);

  let userId = generateRandomString();

  // to check if email is already registered

  for(let userId in users){
    if(useremail === users[userId].email){
      return res.redirect("/login");
    }
  }

  // Error handling for empty inputs

  if(!useremail || !userpassword ){
    res.status(400).send("Please enter username and password!!");
  } else{
    users[userId] = {
      id: userId,
      email: useremail,
      password: userpassword
    };
    req.session.user_id = users[userId].id;
    res.redirect("/urls/new");
  }
})













app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});










