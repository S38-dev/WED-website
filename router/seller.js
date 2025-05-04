const express = require("express")
const bodyparser = require('body-parser')
const router = express.Router()

const {db,addproduct,updateProductImages,editproduct,getSeller,addproductImages,getProductDetail,deleteProduct,getSellerProducts } = require('../db/seller_db');

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
    console.log("req.user:", req.user); 
    const seller= await getSeller(req.user.user_id) ;
    const sellerUser_Id=seller[0].id
    const sellerSellerid=seller[0].seller_id
    const products=await getSellerProducts(sellerSellerid);
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
  console.log("product images...",productImgs)
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

 router.post("/product/update/:productID",productImage.array('new_images',3) ,async (req,res)=>{
  console.log("the product updates is hitting");
  
  const productId=req.params.productID
  console.log("productId",productId)
  console.log("the rwquest body is ",req.body)
  console.log("req.files",req.body.delete_imgs)
  if(req.body.delete_imgs){
    await db.query(`delete from product_img where product_img=$1`,[req.body.delete_imgs])
  }
  await editproduct(productId,req.body)
 console.log("files in sellerProductView",req.files)
 await updateProductImages(productId,req.files)
  res.redirect("/seller/sellerhub")

 })





 router.post("/product/delete/:productid",productImage.any(),async(req,res)=>{
   console.log("productId",req.params.productid)
   await deleteProduct(req.params.productid);
   res.redirect("/seller/sellerhub")
 })




module.exports = router;
