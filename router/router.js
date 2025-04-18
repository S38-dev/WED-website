const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()
const multer  = require('multer')

const nodemailer = require('nodemailer');
const { db,addcomment, getcomment,getCartItems, getProduct,getfilteredproduct,getUserProfilePic } = require('../db/db');


//home

router.get("/", async (req, res) => {
 console.log("Route / is being hit");

    try {
        let Active_profile_pic ;
        const userobj = await getcomment(); // Fetch comments

        console.log("comments in home " ,userobj);
        let all_comments = userobj?.comment || [] ;

        let user = userobj?.user_id || "guest";

        let profile_pic = userobj ?.profile_pic ||"../public/imgs/default.png";
        

        let user_name=userobj?.name || "guest";
        let user_data = req.user; // this is from passport
       
         let activeuser = user_data?.username ||null;
         console.log("active user ", activeuser)

         if(activeuser){ 
            const pic = await getUserProfilePic(activeuser);
            if (pic) 
                {
                    console.log("pic is getting ",pic)
                    Active_profile_pic = "/uploads/" + pic;
                }
         }
         const user_role = res.locals.user_role || "guest";
         console.log("userrole in home page ",user_role)


        
       



        

        if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            res.json({ all_comments, user, user_profile: profile_pic });
        } else {
            res.render("home.ejs", { all_comments, user, user_profile: profile_pic,user_name,activeuser, Active_profile_pic :Active_profile_pic ,user_role });
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


router.get("/photography", async(req, res) => {
    
       
    const result = await getProduct("photography");
    

    
    res.render('photography',{result:result})
    
})


router.post("/photography/action", (req, res) => {

    if (req.body.action == addcart) {
        addcartitem(req.body)
       res.status(500);
    }

}) 

//catering

router.get("/catering", (req, res) => {
    const user_id = req.user ? req.user.gmial : null;
    res.render('catering.ejs',{user_id})


})
 
router.post("/catering/action",(req,res)=>{
   if (req.body.action== addcart){
    addcartitem( req.body)
   
}

})


router.post("/photography/filter", async (req, res) => {
    try {
      const result = await getfilteredproduct(req.body.value); // assume async
      console.log("result from db ",result)
      res.json({ result:result }); // sends a JSON object with the result
    } catch (error) {
      console.error("Error filtering products:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  });
  


//review or comment 

router.get("/review/add-review", async (req, res) => {
    res.render("comment.ejs")

})




router.get("/more_reviews",async(req,res)=>{
    try {
        const userobj = await getcomment(); // Fetch comments
        console.log("more review")

        console.log(userobj);
        let all_comments = userobj?.comment || [] ;
        let user = userobj?.user_id || "guest";
        let profile_pic = userobj ?.profile_pic ||"../public/imgs/default.png";
        let role=userobj?.role||"viewer"
        if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            res.json({ all_comments, user, user_profile: profile_pic });
        } else {
            res.render("more_review", { all_comments, user, user_profile: profile_pic });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Internal Server Error");
    }
}) 








router.post("/review/add-review",async (req,res)=>{
    if(req.body.comment){
   let comment =req.body.comment;
   // add these comments to pg database
  await addcomment(comment);
    }
  
    res.redirect('/');
})


//cart

router.get("/cart", (req, res) => {
// using if to get to the cart.ejs 
if (!req.isAuthenticated() || !req.user) {
    console.log("hlw")
    return res.redirect("/user/login"); // Or send a message, your choice.
  }
  else{
   const usercart =getCartItems(req.user.gmail)||null;
   res.render("cart",{cartItems:usercart})
  }


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

router.get("TargerProfile/:username",  async (req,res)=>{
     
    const targetUser= req.params.username
    const currentUser=req.user.username
    const result = await db.query("SELECT * FROM users WHERE NAME=$1",[targetUser])
    
    res.render("profile",{Targeteduser:result.rows[0] , currentUser})

})



router.get ("/product_details/:product_id", async (req,res)=>{
    
    const id = req.params.product_id;
    const productimgs= await db.query("SELECT * FROM products INNER JOIN product_img ON product_img.product_id=products.product_id  WHERE products.product_id =$1",[id])
    console.log("the ptoduct that is being clicked ",productimgs)
    res.render("product_details",{imgs:productimgs.rows})

})



// Mock user DB



module.exports = router;