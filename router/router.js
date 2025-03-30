const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()

app.use(express.urlencoded({ extended: true })); 
const { addcomment, getcomment } = require('../db/db');

router.get("/", (req, res) => {
    
     
    res.render('home.ejs');

})

router.get("/home", async (req, res) => {

    const comments = await getcomment();
    console.log(comments);
    let all_comments = comments.comment
    let user = user.user_id
    res.render('home.ejs', { all_comments: all_comments, user: user });

})

router.get("/galary", (req, res) => {

    res.render('galary.ejs')

})

router.get("/photography", (req, res) => {

    res.render('photography.ejs')

})

router.get("/catering", (req, res) => {

    res.render('catering.ejs')

})

//showing review on home page
router.get("/add-review", async (req, res) => {
    res.render("comment.ejs")

})
// adding review
router.post("/add-review",async (req,res)=>{
   let comment =req.body.comment;
   // add these comments to pg database
  await addcomment(comment);
   
  
    res.redirect('/');
})
router.get("/profile", (req, res) => {
     
    res.render('profile.ejs')

}) 
router.get("/edit",(req,res)=>{
  res.render("editpage")

})
router.post("/upload",(req,res)=>{
  //adding the profile pic  file here 
  

} )
router.get("/logout", (req, res) => {

    res.render('login.ejs')
       
})
router.get("/register",(req,res)=>{
    // adiing basic local passport authetication here        
})
router.get("/cart",(req,res)={
// using if to get to the cart.ejs 
  
//using else if to get the delete option 


})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});