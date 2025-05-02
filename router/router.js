const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app = express()
const multer = require('multer')


const { db, addcomment, getcomment, getCartItems, getProduct, getfilteredproduct, getUserProfilePic } = require('../db/db');

const Razorpay = require('razorpay');


router.get("/", async (req, res) => {
    console.log("Route / is being hit");

    try {
        let Active_profile_pic;
        const userobj = await getcomment(); // Fetch comments

        console.log("comments in home ", userobj);
        let all_comments = userobj || [];
        console.log("all comment ", all_comments)

        let user = userobj?.user_id || "guest";

        let profile_pic = userobj?.profile_pic || "../public/imgs/default.png";
        console.log("comment pic", user)


        let user_name = userobj?.name || "guest";
        let user_data = req.user;

        let activeuser = user_data?.username || null;
        console.log("active user ", activeuser)

        if (activeuser) {
            const pic = await getUserProfilePic(activeuser);
            if (pic) {
                console.log("pic is getting ", pic)
                Active_profile_pic = "/uploads/" + pic;
            }
        }
        const user_role = res.locals.user_role || "guest";
        console.log("userrole in home page ", user_role)









        if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            res.json({ all_comments, user, user_profile: profile_pic });
        } else {
            res.render("home.ejs", { all_comments, user, user_profile: profile_pic, user_name, activeuser, Active_profile_pic: Active_profile_pic, user_role });
        }


    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Internal Server Error");
    }
});







router.get("/home", async (req, res) => {

    res.redirect("/")
})

router.get("/galary", (req, res) => {

    res.render('galary.ejs')

})


router.get("/photography", async (req, res) => {


    const result = await getProduct("Photography");



    res.render('photography', { result: result })

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
    res.render('catering.ejs', { user_id })


})

router.post("/catering/action", (req, res) => {
    if (req.body.action == addcart) {
        addcartitem(req.body)

    }

})


router.post("/photography/filter", async (req, res) => {
    try {
        const result = await getfilteredproduct(req.body.value); // assume async
        console.log("result from db ", result)
        res.json({ result: result }); // sends a JSON object with the result
    } catch (error) {
        console.error("Error filtering products:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
});



//review or comment 

router.get("/review/add-review", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("comment.ejs")
    }
    else {
        res.redirect("/user/login")

    }

})




router.get("/more_reviews", async (req, res) => {
    try {
        const comments = await getcomment();
        res.render("more_review", {
            all_comments: comments,
            user: req.user ? req.user.name : 'Guest',
            // user_profile: comments.profile_pic?"/uploads/"+comments.profile_pic:'/imgs/default.png'
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Internal Server Error");
    }
});







router.post("/review/add-review", async (req, res) => {
    if (req.body.comment) {
        let comment = req.body.comment;
        if (req.isAuthenticated()) {
            console.log("user is in add comment ", req.user)


            await addcomment(comment, req.user.user_id);
        }
    }

    res.redirect('/');
})


//cart

router.get("/cart", async (req, res) => {

    if (!req.isAuthenticated() || !req.user) {
        console.log("hlw")
        return res.redirect("/user/login");
    }
    else {
        const usercart = await getCartItems(req.user.user_id) || null;
        console.log("csrtitems", usercart)
        res.render("cart", { cartItems: usercart })
    }


})

router.get("/addCart/:productId", async (req, res) => {
    console.log("product id in add cart ", req.params.productId)
    const productId = req.params.productId
    const userID = res.locals.user_id;
    console.log("userid in addcart", userID)
    const result = await db.query("select cart_id from cart where user_id= ($1)", [userID]);
    console.log("the cart id ", result.rows)
    db.query("INSERT INTO cart_items (cart_id,product_id) values($1,$2)", [result.rows[0].cart_id, productId])
    res.redirect("/cart")



})




router.post("/cart/action", (req, res) => {
    if (req.body.action == "checkout") {
        res.render("payment")

    }
    if (req.body.action == "delete") {
        deleteCartItem(req.body.product_id)
        res.render("cart")

    }


})

router.get("TargerProfile/:username", async (req, res) => {

    const targetUser = req.params.username
    const currentUser = req.user.username
    const result = await db.query("SELECT * FROM users WHERE NAME=$1", [targetUser])

    res.render("profile", { Targeteduser: result.rows[0], currentUser })

})



router.get("/product_details/:product_id", async (req, res) => {
    try {
        const productId = parseInt(req.params.product_id);


        if (isNaN(productId)) {
            return res.status(400).send("Invalid product ID");
        }

        const query = `
            SELECT p.*, pi.product_img 
            FROM products p
            JOIN product_img pi ON p.product_id = pi.product_id
            WHERE p.product_id = $1`;

        const result = await db.query(query, [productId]);

        if (result.rows.length === 0) {
            return res.status(404).send("Product not found");
        }
        console.log("fronend passed structure ", result.rows[0])

        res.render("product_details", {
            product: result.rows[0],
            images: result.rows.map(row => row.product_img)
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send("Server error");
    }
});
router.delete("/cart/:itemId", async (req, res) => {
    try {
        const query = "DELETE FROM cart_items where cart_item_id =$1"
        await db.query(query, [req.params.itemId]);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.log("error while deleting the item", err)
        res.status(500).json({ message: 'An error has been occurred' });
    }
})

router.get("/checkout/:cartItems", (req, res) => {
    const decodedCartItems = decodeURIComponent(req.params.cartItems);
    const cartItems = JSON.parse(decodedCartItems);
    console.log("Parsed cartItems:", cartItems);
    res.render("checkout", { cartItems });
})


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,

})

router.post("/payment", async (req, res) => {
    const amount = req.body.amount;
    const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    };
    try {
        const response = await razorpay.orders.create(options);
        res.json({ response, key_id: process.env.RAZORPAY_KEY_ID, });
    }
    catch (err) {
        res.status(500).send({ message: "something went wrong" })
    }
})





module.exports = router; 