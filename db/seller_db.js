const {db} = require("./db")



async function  editproduct(id, newtext){
   const query ="UPDATE products SET product_text = $1 WHERE product_id = $2 RETURNING *"
  try{
   const res=await db.query(query ,[newtext,id])
   console.log(res.rows);
   }catch (err) {
    console.log("error updating product ")
     

}
}
async function addproduct( product ){
  console.log("the product that needs to be aded" ,product)
const query= " INSERT INTO products  (product_name, product_text, product_price, product_pic, seller_id)  VALUES ($1 ,$2 ,$3 ,$4 ,$5) returning *"
try{
  const res = await db.query(query, [
      product.name,
      product.product_text,
      product.product_price, 
      product.product_pic,
      product.seller_id
    ]);
  console.log(res.rows[0])
}catch(err){
   
 console.log("error on adding product ")
}

}
module.exports = {
  addproduct,
  editproduct,
};

