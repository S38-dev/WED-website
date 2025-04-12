const express = require("express");
const ejs = require("ejs");
const app = express();
const session = require("express-session"); 
const path = require('path');


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


var passport = require('passport');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 // Import router
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, 'public')));

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
