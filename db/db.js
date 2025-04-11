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

// Function to add a comment
async function addcomment(comment) {
  const query = 'INSERT INTO comment(comment) VALUES ($1) RETURNING *';
  try {
    const result = await db.query(query, [comment]);
    console.log('Comment added:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding comment:', error.message);
    throw error;
  }
}

// Function to fetch all comments
async function getcomment() {
  const query = `select users.name,comment.comment, users.profile_pic ,users.role,users.name FROM comment INNER JOIN
    users on users.id=comment.user_id               
`
  try {
    const res = await db.query(query);
    
    console.log('Fetched comments:', res.rows);
    return res.rows; // Return the fetched comments
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    throw error;
  }
}

async function getCartItems(user_id){
   const query = `SELECT 
    cart.cart_id,
    cart.user_id,
    cart_items.item_id,
    cart_items.quantity,
    products.product_id,
    products.product_name,
    products.product_price 
FROM cart
INNER JOIN cart_items ON cart.cart_id = cart_items.cart_id
INNER JOIN products ON cart_items.product_id = products.product_id
WHERE cart.user_id = $1;`;
  try {
    const res = await db.query(query,[user_id]);
    console.log('Fetched comments:', res.rows);
    return res.rows; // Return the fetched comments
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    throw error;
  }
}



async function addcartitem(product){
// adding cart product here
   
}
async function getPassword(username){
  try {
   const query="Select password from users where  gmail = $1 "
    const res = await db.query(query,[username]);
    console.log('Fetched comments:', res.rows);
    return res.rows;  

} catch(err){
  console.log("error in getting the password ",err.message)
}


}


async function adduser(user){
 try{

 const query="INSERT INTO users(name,age,profile_pic,gmail,password,role) values($1,$2,$3,$4,$5,$6,$7) RETURNING *  "
 const res= await db.query(query,[user.name,user.age,user.profile_pic,user.gmail,user.password,user.role])
  console.log("new user",res.rows)
}catch(err){}
 console.error('Error adding comment:', err.message);
}



// Export functions for use in other modules
module.exports = {
  db,
  addcomment,
  getcomment,
  getCartItems,
  adduser,
};
