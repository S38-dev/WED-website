const pg = require('pg');
const { Client } = pg;

// PostgreSQL configuration
const db = new Client({
  user: 'postgres',
  host: 'localhost',   
  database: 'wd',
  password: '1234',
  port: 5432,
});

// Connect to the database
db.connect().then(() => {
  console.log('Connected to the database');
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1); // Exit the app if the connection fails
});

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

