const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()

app.use(express.urlencoded({ extended: true })); 
const { addcomment, getcomment } = require('../db/db');
router.get("/", (req, res) => {
    

    res.render('home.ejs');

})

router.get("/home", (req, res) => {
    

    res.render('home.ejs');
   
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
    console.log( await getcomment());
    const comments = await getcomment();
     
    res.render('home',{ comments:comments  , user })

})
// adding review
router.post("/add-review",(req,res)=>{
   let comment =req.body.comment;
   // add these comments to pg database
   addcomment(comment);
})

router.get("/profile", (req, res) => {
     
    res.render('profile.ejs')

}) 
router.get("/edit",(req,res)=>{
  res.render("editpage")

})
router.post("/upload",(req,res)=>{
  //adding the file here 
  

} )
router.get("/logout", (req, res) => {

    res.render('login.ejs')
    
})
router.get("/register",(req,res)=>{
    // adiing basic local passport authetication here
})
