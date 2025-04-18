const express = require("express");
const ejs = require("ejs");
const app = express();
const session = require("express-session"); 
const path = require('path');
const{getUserProfilePic,getUser}=require('./db/db')//db

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


var passport = require('passport');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 // Import router
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'router/uploads')));
process.setMaxListeners(20); 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
 


 // Fix typo from "pubic" to "public"
app.use(passport.initialize());
app.use(passport.session());

const router = require("./router/router");
const user_router=require("./router/user_account");
app.use((req, res, next) => {
  res.locals.activeuser = req.isAuthenticated() && req.user ? req.user.username : null;
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





app.use("/" , router)
app.use("/user",user_router)


// app.get('/photography', (req, res) => {
//   res.render('photography'); // views/photography.ejs
// });


// app.use("/photography",router)
//  // Use router 

// app.use("photography/action",router)



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
