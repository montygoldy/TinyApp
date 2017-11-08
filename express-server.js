const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get('/', (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]}
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = ;
  res.redirect(longURL);
});

// function to generate random number

function generateRandomString(){
  return Math.random().toString(36).substring(2, 8);
}

app.post("/urls", (req, res) => {
  const url = req.body;
  url.shortURL = generateRandomString();
  urlDatabase[url.shortURL] = url.longURL;
  res.redirect("urls/" + url.shortURL);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});










