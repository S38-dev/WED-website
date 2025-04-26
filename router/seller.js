const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()
const app=express()
const {addproduct,editproduct,getSellerProducts,addproductImages,getProductDetail,deleteProduct } = require('../db/seller_db');
app.use(express.urlencoded({ extended: true })); 
const multer=require("multer")
const path = require('path');
const productImage= multer({ dest: path.join(__dirname, 'product_images') })

// app.post("/sellerhub", async(req, res) => {
//     if (req.body.action == "edit") {
//         // add the edited value to the db
//         await editproduct(req.body.product_id, req.body.newtext)

      

//         res.render("seller_hub", { products: getproducts()})
//     }


// })
router.get("/sellerhub", async (req, res) => {
    console.log("isAuthenticated?", req.isAuthenticated());
    if(req.isAuthenticated()){
    console.log("req.user:", req.user); // Should NOT be undefined
    const products= await getSellerProducts(req.user.user_id) ;
    const sellerUser_Id=products[0].id
    const sellerSellerid=products[0].seller_id
    console.log("sellerUser_Id",sellerUser_Id)
    console.log("produxts in sellerhub route",products  )
    
    res.render("seller_hub", { products: products, userID: sellerUser_Id, sellerSellerId: sellerSellerid });
    
}});


router.get("/sellerhub/add/:seller_id", async  (req, res) => {
    const sellerID=req.params.seller_id;
    console.log("hitting seller add route ")
     
    
      res.render("add_product",{ sellerID })



  
   
    //   if (req.body.action == "edit") {
    //     // add the edited value to the db
    //     await editproduct(req.body.product_id, req.body.newtext)
       
      

    //     res.render("seller_hub", { products: getproducts()})
    // }
    
})

router.get("/productdetail/:productid", async (req,res)=>{
  const productId=req.params.productid;
  const product= await getProductDetail(productId)
  console.log("product is comming from getProductDeaitils",product)
  const product_id=product[0].product_id
  const productName=product[0].product_name
  const productprice=product[0].product_price
  const productDes=product[0].product_text
  const productImgs=product.map(p=>p.product_img)
  res.render("sellerProductView",{product ,product_id,productName,productprice,productDes,product,productImgs})


})

 router.post("/sellerhub/add/:seller_id", productImage.array('productImages[]', 3),async (req,res)=>{
    
        console.log("post form seller hub ",req.body)
        console.log("files are ", req.files)
        await addproduct(req.body ,req.params.seller_id);
        const filename=req.files.map(file=>file.filename)
        console.log("filenames" ,filename)

       
        await addproductImages(filename,req.body.productName);
        res.redirect("/seller/sellerhub")
        

 
})

 router.post("/product/update/:productID",productImage.any() ,async (req,res)=>{
  console.log("the product updates is hitting");
  
  const productId=req.params.productID
  console.log("productId",productId)
  console.log("the rwquest body is ",req.body)
  await editproduct(productId,req.body)
  res.redirect("/seller/sellerhub")

 })
 router.post("/product/delete/:productid",productImage.any(),async(req,res)=>{
   console.log("productId",req.params.productid)
   await deleteProduct(req.params.productid);
   res.redirect("/seller/sellerhub")
 })

module.exports = router;