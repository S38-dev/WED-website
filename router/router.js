const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()
app.use(express.urlencoded({ extended: true })); 

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


router.get("/add-review", (req, res) => {

    res.render('home',{ review:review })

})

router.post("/add-review",(req,res)=>{
   let comment =req.body.comment;
   // add these comments to pg database
  
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
