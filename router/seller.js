const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()
const {addproduct,editproduct } = require('../db/seller_db');
app.use(express.urlencoded({ extended: true })); 

app.post("/sellerhub", async(req, res) => {
    if (req.body.action == "edit") {
        // add the edited value to the db
        await editproduct(req.body.product_id, req.body.newtext)

      

        res.render("seller_hub", { products: getproducts()})
    }


})
app.get("/sellerhub", (req, res) => {
    res.render("seller_hub", { products: getProducts() });
});


app.post("/addproduct", async  (req, res) => {
    if (req.body.action == "addproduct") {
        //add new product 
       await  addproduct(req.body)

      let  products = getproducts()
        res.render("seller_hub", { products: products })
    }


})
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
