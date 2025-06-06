
const format = require('pg-format');

const { db } = require("./db")



async function editproduct(id, body) {
  const query = "UPDATE products SET  product_name=$1 , product_text=$2, product_price= $3 WHERE product_id = $4 RETURNING *"
  try {
    console.log("type of ", typeof(body.product_name ))
    const res = await db.query(query, [body.product_name , body.product_text, body.product_price,id])
    console.log(res.rows);
  } catch (err) {
    console.log("error updating product ",err)


  }
}
async function addproduct(product, sellerID) {
  console.log("the product that needs to be aded", product)
  const query = " INSERT INTO products  (product_name, product_text, product_price, product_type, seller_id)  VALUES ($1 ,$2 ,$3 ,$4 ,$5) returning *"
  try {
    const res = await db.query(query, [
      product.productName,
      product.productdescription,
      product.price,
      product.selectedoption,
      sellerID

    ]);
    console.log(res.rows[0])
  } catch (err) {

    console.log("error on adding product ", err)
  }

}

async function addproductImages(filearr, productName) {
  const id = await db.query("SELECT product_id from products where product_name=$1", [productName])
  const values = filearr.map(filename => [id.rows[0]. product_id, filename]);
  console.log("fetching prductid", id.rows[0]. product_id);
  const query = format('INSERT INTO product_img (product_id,product_img) VALUES %L ', values);

await db.query(query);
const allImg=await db.query("SELECT product_img FROM product_img where product_id =$1",[id.rows[0]. product_id]);
console.log("allImg ",allImg)
const profileImg= allImg.rows[0].product_img;

console.log("profileImg",profileImg);
await db.query(
  "UPDATE products SET product_pic = $1 WHERE product_id = $2",
  [profileImg,id.rows[0]. product_id]
);
 





}

async function deleteProduct(product_id){
 await db.query(`DELETE FROM products
WHERE product_id =$1`,[product_id])
}

async function getSeller(user_id) {
 
  try {
    let res = await db.query(
      `SELECT seller.seller_id, users.id, users.gmail
      FROM seller 
      INNER JOIN users ON seller.user_id = users.id   
      WHERE users.id = $1;`,
      [user_id]
    );
    console.log("result of getSeller ", res.rows);
    return res.rows;
  } catch (err) {
    console.log("error fetching seller products", err);
  }
}
 async function getProductDetail(productId){
  console.log("getsellerproduct riute is hitting")
  const query="SELECT products.* ,product_img.product_img ,product_img.product_img_id FROM products LEFT JOIN product_img on product_img.product_id=products.product_id where products.product_id=$1 "
 const res=await db.query(query,[productId]) 
 console.log('db response ',res)
 return res.rows
}

async function getSellerProducts(sellerid){
    const query=`select products.* from products where seller_id= $1`
    try{
    const res=await db.query(query,[sellerid]) 
    if(res.rows.length>0){
      console.log("seller's all products ",res)
      return res.rows
    }
    else{
      return null
    }
  }catch(e){
    console.log("error to fetch  products",e)
  }
}

async function updateProductImages(productid,files){
  
  const array=files.map(file=>[productid,file.filename]);
  console.log("the array",array)
  try{
    const query=format("insert into product_img(product_id,product_img) values %L RETURNING *",array)
   const res=await db.query(query);
   console.log("debugging the img update",res.rows)
  }catch(e){
    console.log("error adding new images ",e)
  }

}
module.exports = {
  db,
  addproduct,
  editproduct,
  getSeller,
  addproductImages,
  getProductDetail,
  deleteProduct,
  getSellerProducts,
  updateProductImages,
};

