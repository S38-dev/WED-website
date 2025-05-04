const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
var session = require('express-session')

var passport = require('passport');
var LocalStrategy = require('passport-local');
const path = require('path');
const multer = require("multer");




const upload = multer({ dest: path.join(__dirname, 'uploads') }); //multer




const { db,addcomment, getcomment, getCartItems, getPassword ,adduser,addprofilepic,getUserProfilePic} = require('../db/db');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}


router.get("/profile/:username", (req, res) => {
  console.log("Authenticated?", req.isAuthenticated());
  console.log("User:", req.user);
  if (req.isAuthenticated()){
    res.render('profile');
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


router.post("/profile/edit/upload",ensureAuthenticated, upload.single('profile_pic'), (req, res) => {
  //adding the profile pic  file here 
   console.log("profile route is hitting uploaded file....",req.file)
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
 else {
  console.log("req user is working here:",req.user.username)
   addprofilepic(file.filename, req.user.username );
  res.json({ message: "Upload successful", redirectUrl: "/" });
  }

})



router.get("/logout", (req, res) => {
 

  req.logout(() => {
    res.redirect("/");
  });
});





router.get("/login", (req, res) => {
  console.log("hitting login"); 

  res.render("login");

})




router.post("/login/submit", passport.authenticate("local",{
   
  successRedirect: '/',
  failureRedirect:'/user/login',
  failureFlash: true

}))





//local 
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  console.log("username : ",username);
  try {
    const user_result = await getPassword(username);//from db
   
    console.log("hashreasult ", user_result)
    if  (user_result.length === 0) {
      return cb(null, false, { message: "Incorrect username or password." });
    }
    const isMatch = await bcrypt.compare(password, user_result[0].password);

    
    if (!isMatch) {
      return cb(null, false, { message: "Incorrect username or password." });
    }

    const profilephoto=await getUserProfilePic(username);



    console.log("user id in db <passport> ",user_result[0].id)
    return cb(null, { username:username ,profilephoto:profilephoto ,user_id:user_result[0].id});
  } catch (err) {
    return cb(err);
  }
}));










router.get("/register", (req, res) => {
     res.render("register")
})






router.post("/register/action", upload.single('uploaded_file'),async (req,res)=>{
   let username = req.body.username
   console.log("getting the user fpor register",username)
  let response= await db.query("SELECT * FROM USERS WHERE gmail=$1",[username])
  if (response.rows.length!=0){
   return res.status(409).send("User already exists. Please log in.");
}



 else {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser= await adduser({
    name:req.body.name,
    gmail: req.body.username,
    password: hashedPassword,
    role: req.body.role || "user", // Default role if not provided
     profile_pic: req.file ? req.file.filename : null,
    age:req.body.age
  });
  
  if(req.body.role=="admin"){
    await db.query("INSERT INTO seller(user_id) values($1)  ",[newUser.id])
  }


   const userID = res.locals.user_id;
      console.log("userId", res.locals.user_id)
      const cartInfo = await db.query(`
          INSERT INTO cart (user_id) values ($1) RETURNING*
          `,[newUser.id]);
      console.log("cart info", cartInfo.rows)
  res.render("register_success"); 

}

})






passport.serializeUser(function(user,cb){
 console.log("the value within serialize user  ",user)
  cb(null,user)

})




passport.deserializeUser(function(user,cb){
  cb(null,user)
  

})



const pinStorage = {};
router.post("/forgot_password", async (req, res) => {
  const gmail = req.body.username;
  console.log("gmail for forgetpassword",gmail)
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  pinStorage[gmail] = {
    pin,
    expires: Date.now() + 15 * 60 * 1000
  };
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'subhojit555666@gmail.com',
          pass: process.env.googlepass
      }
  });
  const mailOptions = {
    from: 'subhojit555666@gmail.com',
    to: gmail,
    subject: 'Your Password Reset PIN',
    text: `Use this PIN to login: ${pin}`
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", gmail);
      res.render("forgotPassword",{gmail})
  } catch (err) {
      console.error("failed to send mail",err);
      res.status(500).send('Failed to send email');
  }
 

})


router.post("/verify_pin",async(req,res)=>{
  console.log("the ptinstorage",pinStorage)
  const pin =pinStorage[req.body.gmail].pin;
  console.log("submit pin",pin)
  const username=req.body.gmail;
  if(pin==req.body.pin){
    const user_result = await getPassword(username);
    const profilephoto=await getUserProfilePic(username);
    const user_id=user_result[0].id
    req.login(
      {
        username:username,
        user_id: user_id,
        profilephoto: profilephoto,
      },
      (err) => {
        if (err) {
          return res.redirect("/user/login");
        }
        delete pinStorage[username];
        return res.redirect("/");
      }
      

    )
    
  }

})


module.exports= router;
