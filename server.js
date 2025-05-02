const express = require("express");
const ejs = require("ejs");
const app = express();
const session = require("express-session"); 
const path = require('path');
const{getUserProfilePic,getUser}=require('./db/db')//db
const flash = require('connect-flash');
require('dotenv').config()

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


var passport = require('passport');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product_images', express.static(path.join(__dirname, 'router/product_images')));
app.use(flash());
app.use('/uploads', express.static(path.join(__dirname, 'router/uploads')));
process.setMaxListeners(20); 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
 


 
app.use(passport.initialize());
app.use(passport.session());

const router = require("./router/router");
const user_router=require("./router/user_account");
const seller=require("./router/seller")


app.use((req, res, next) => {
  res.locals.activeuser = req.isAuthenticated() && req.user ? req.user.username : null;
  res.locals.user_id=req.isAuthenticated()&& req.user?req.user.user_id:null;
  next();
});



app.use(async (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.username) {
    try {
      const pic = await getUserProfilePic(req.user.username);
      res.locals.Active_profile_pic = pic ? "/uploads/" + pic : "/imgs/default-avatar.jpg";
    } catch (error) {
      console.error("Error fetching profile pic in middleware:", error);
      res.locals.Active_profile_pic = "/imgs/default-avatar.jpg";
    }
  } else {
    res.locals.Active_profile_pic = "/imgs/default-avatar.jpg";
  }
  next();
});

app.use(async (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.username) {
    try {
      const user= await getUser(req.user.username);
      console.log("user getting from getuser",user)
      res.locals.user_role = user ?user.role:"guest";
    } catch (error) {
      console.error("Error getting user in middleware:", error);
      
    }
  } 
  next();
});


app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


app.use("/" , router)
app.use("/user",user_router)
app.use("/seller",seller)




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
