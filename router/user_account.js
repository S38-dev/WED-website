const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require("multer");
var session = require('express-session')
app.use(express.urlencoded({ extended: true }));
var passport = require('passport');
var LocalStrategy = require('passport-local');
const { addcomment, getcomment, getCartItems, getPassword } = require('../db/db');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


router.get("/profile", (req, res) => {
  if (req.isAuthenticated()){
    res.render('profile.ejs');
  } else {
    res.redirect("/login");
  }
});


router.get("/profile/edit", (req, res) => {

  if (req.isAuthenticated()) {
    res.render("editpage")
  } else {
    res.redirect("/login");
  }
})
router.post("/profile/edit/upload", (req, res) => {
  //adding the profile pic  file here 
   res.render("editpage")
  if (req.isAuthenticated()) {
    res.render("updload_profile")
  } else {
    res.redirect("/login");
  }

})
router.get("/logout", (req, res) => {

})

router.get("/login", (req, res) => {

  res.render("login");

})
router.post("/login/submit", passport.authenticate("local",{

  successRedirect: '/',
  failureRedirect: '/login'

}))

//local 
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const hashresult = await getPassword(username);
    if (hashresult.rows.length === 0) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    const isMatch = await bcrypt.compare(password, hashresult.rows[0].password);
    if (!isMatch) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    return cb(null, { username: username });
  } catch (err) {
    return cb(err);
  }
}));

passport.serilizer(function(user,cb){
  cb(null,user)

})

passport.deserializeUser(function(user,cb){
  cb(null,user)

})








router.get("/register", (req, res) => {
  // adiing basic local passport authetication here        
})