const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// URL database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

// Rendering the default page to urls new page

app.get('/', (req, res) => {
    res.redirect('/urls/new');
})

//Check to see the json render of the database

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

// Rendering all the urls

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                       user: req.cookies["user_id"]
                     };
  res.render("urls_index", templateVars);
});

// Route for creating new url

app.get("/urls/new", (req, res) => {
  let templateVars = {user: req.cookies["user_id"]}
  if(req.cookies["user_id"]){
    res.render("urls_new", templateVars);
  } else{
    res.redirect("/login");
  }
});

// Route to check the longurl of th shorturl

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       user: req.cookies["user_id"]
                     }
  res.render('urls_show', templateVars);
});

// To grab the orignal link of the shortURL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


//Post submission form and redirect to 6 digit random url page

app.post("/urls", (req, res) => {
  const url = req.body;
  url.shortURL = generateRandomString();
  urlDatabase[url.shortURL] = url.longURL;
  res.redirect("urls/" + url.shortURL);
});

//Deleting links from the database

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//Editing links

app.post("/urls/:id", (req, res) => {
  shortURL = req.params.id
  let url = req.body;
  urlDatabase[req.params.id] = url.longURL;
  res.redirect( shortURL);
});

// Login Route

app.post("/login", (req, res) => {
  let useremail = req.body.email;
  let userpassword = req.body.password;
  let found = false;

  for(userId in users){
    if(useremail === users[userId].email && userpassword === users[userId].password){
      found = true;
    }
  }

  if(found){
    res.cookie("user_id");
    res.redirect("/urls");
  } else{
    res.statusCode(400).send("Email and password not matching!!! Try Again");
  }
});


app.get("/login", (req, res) => {
  let templateVars = {user: req.cookies["user_id"]}
  res.render("login", templateVars);
})


// Logout route

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Register new user

app.get("/register", (req, res) => {
  let templateVars = {user: req.cookies["user_id"]}
  res.render("register_user", templateVars);
})

app.post("/register", (req, res) => {
  let useremail = req.body.email;
  let userpassword = req.body.password;
  let userId = generateRandomString();

  // to check if email is already registered

  for(let userId in users){
    if(useremail === users[userId].email){
      res.redirect("/register");
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

    res.cookie("user_id", users[userId]);
    res.redirect("/urls");
  }
})













app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});










