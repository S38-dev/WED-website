const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()

app.use(express.urlencoded({ extended: true })); 
const { addcomment, getcomment,getCartItems } = require('../db/db');
let user_id ;


//home

router.get("/", (req, res) => {
    
     
    res.render('home.ejs');

})

//galary



router.get("/home", async (req, res) => {

    const comments = await getcomment();
    console.log(comments);
    let all_comments = comments.comment
    let user = user.user_id
    res.render('home.ejs', { all_comments: all_comments, user: user_id });
     
})

router.get("/galary", (req, res) => {

    res.render('galary.ejs')

})

//photography


router.get("/photography", (req, res) => {

    res.render('photography',{user_id })

}) 
router.post("/photography/action", (req, res) => {

    if (req.body.action == addcart) {
        addcartitem(req.body)
       res.status(500);
    }

}) 

//catering

router.get("/catering", (req, res) => {
     
    res.render('catering.ejs',{user_id})

})
 
router.post("/catering/action",(req,res)=>{
   if (req.body.action== addcart){
    addcartitem( req.body)
   
}

})


//review

router.get("/review/add-review", async (req, res) => {
    res.render("comment.ejs")

})

router.post("/review/add-review",async (req,res)=>{
   let comment =req.body.comment;
   // add these comments to pg database
  await addcomment(comment);
   
  
    res.redirect('/');
})


//cart

router.get("/cart", (req, res) => {
// using if to get to the cart.ejs 
   res.render("cart",{cartItems:getCartItems(raq.body.user_id)})
  


})
 router.post("/cart/action" ,(req,res)=>{
   if (req.body.action =="checkout"){
    res.render("payment")

}
 if (req.body.action=="delete"){
    deleteCartItem(req.body.product_id)
    res.render("cart")

} 

})



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});