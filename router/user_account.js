const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt');
const saltRounds = 10;

var session = require('express-session')
app.use(express.urlencoded({ extended: true }));
var passport = require('passport');
var LocalStrategy = require('passport-local');
const path = require('path');
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, 'uploads') }); //multer
app.use(express.urlencoded({ extended: true })); 
const { db,addcomment, getcomment, getCartItems, getPassword ,adduser} = require('../db/db');




router.get("/profile/:username", (req, res) => {
  if (req.isAuthenticated()){
    res.render('profile.ejs');
  } else {
    res.redirect("/login");
  }
});


router.get("/profile/:username/edit", (req, res) => {

  if (req.isAuthenticated()  ) {
    if(req.params.username==req.user.username){
    res.render("editpage")
    }
   else{
   console.log("you arent allowed to edit another user's information")

}
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
  res.render("login");
})

router.get("/login", (req, res) => {
console.log("hitting login")
  res.render("login");

})
router.post("/login/submit", passport.authenticate("local",{

  successRedirect: '/',
  failureRedirect: '/login'

}))

//local 
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const hashresult = await getPassword(username);//from db
    if (hashresult.rows.length === 0) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    const isMatch = await bcrypt.compare(password, hashresult.rows[0].password);
    if (!isMatch) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    return cb(null, { username:username });
  } catch (err) {
    return cb(err);
  }
}));










router.get("/register", (req, res) => {
     res.render("register")
})
router.post("/register/action", upload.single('uploaded_file'),async (req,res)=>{
   let username = req.body.gmail
  let response= await db.query("SELECT * FROM USERS WHERE gmail=$1",[username])
  if (response.rows.length!=0){
   return res.status(409).send("User already exists. Please log in.");
}

 else {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
     await adduser({
    name:req.body.name,
    gmail: req.body.gmail,
    password: hashedPassword,
    role: req.body.role || "buyer", // Default role if not provided
     profile_pic: req.file ? req.file.filename : null,
    age:req.body.age
  });
}

})

passport.serializeUser(function(user,cb){
 console.log("the value within serialize user  ",user)
  cb(null,user)

})

passport.deserializeUser(function(user,cb){
  cb(null,user)
  
})
module.exports= router;