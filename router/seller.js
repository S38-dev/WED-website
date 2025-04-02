const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()
const {addproduct,editproduct } = require('../db/seller_db');
app.use(express.urlencoded({ extended: true })); 

// app.post("/sellerhub", async(req, res) => {
//     if (req.body.action == "edit") {
//         // add the edited value to the db
//         await editproduct(req.body.product_id, req.body.newtext)

      

//         res.render("seller_hub", { products: getproducts()})
//     }


// })
router.get("/sellerhub", (req, res) => {
    res.render("seller_hub", { products: getProducts() });
});


router.post("/sellerhub/action", async  (req, res) => {
     
    if (req.body.action=="add_product"){
      res.render("add_product")

}

  
   
      if (req.body.action == "edit") {
        // add the edited value to the db
        await editproduct(req.body.product_id, req.body.newtext)
       
      

        res.render("seller_hub", { products: getproducts()})
    }
    
})

 router.post("/sellerhub/add", (req,res)=>{
    
         addproduct(req.body);
        res.removeHeader("seller_hub");
 
})

const PORT = 3000;
router.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
