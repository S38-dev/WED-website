const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()

app.use(express.urlencoded({ extended: true })); 
const { addcomment, getcomment,getCartItems } = require('../db/db');
let user_id ;


//home

router.get("/", async (req, res) => {
 console.log("Route / is being hit");

    try {
        const comments = await getcomment(); // Fetch comments

        console.log(comments);
        let all_comments = comments.comment;
        let user = comments.user_id;
        let profile_pic = comments.profile_pic;

        if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            res.json({ all_comments, user, user_profile: profile_pic });
        } else {
            res.render("home.ejs", { all_comments, user, user_profile: profile_pic });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Internal Server Error");
    }
});
    
    

//galary



router.get("/home", async (req, res) => {
  
   res.redirect("/")
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


//review or comment 

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

router.get("TargerProfile/:username", async (req,res)=>{
    const targetUser= req.params.username
    const currentUser=req.user.username
    const result = await db.query("SELECT * FROM users WHERE NAME=$1",[targetUser])
    
    res.render("profile.ejs",{Targeteduser:result.rows[0] , currentUser})

})


module.exports = router;