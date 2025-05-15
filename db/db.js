const pg = require('pg');
const { Client } = pg;
const format = require('pg-format');

// PostgreSQL configuration
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'wd',
  password: '',
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
async function addcomment(comment,userId) {
  const query = 'INSERT INTO comment(comment,user_id) VALUES ($1,$2) RETURNING *';
  try {
    const result = await db.query(query, [comment,userId]);
    console.log('Comment added:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding comment:', error.message);
    throw error;
  }
}


async function getcomment() {
  const query = `select users.name,comment.comment, users.profile_pic ,users.role,users.gmail FROM comment INNER JOIN
    users on users.id=comment.user_id               
`
  try {
    const res = await db.query(query);

    console.log('Fetched comments:', res.rows);
    return res.rows
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    throw error;
  }
}

async function getCartItems(user_id) {
  const query = `SELECT 
    cart.cart_id,
    
    cart_items.cart_item_id,
    
    products.product_id,
    products.product_name,
    products.product_price,
    products.product_pic
   FROM cart
   INNER JOIN cart_items ON cart.cart_id = cart_items.cart_id
   INNER JOIN products ON cart_items.product_id = products.product_id
   WHERE cart.user_id = $1;`;
  try {
    const res = await db.query(query, [user_id]);
    console.log('Fetched cart item:', res.rows);
    return res.rows; // Return the fetched comments
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    throw error;
  }
}




async function addcartitem(product) {
  // adding cart product here

}
async function getPassword(username) {
  console.log("hitting  get password")
  console.log("Looking for username (gmail):", username);
  try {
    const query = "Select password,id from users where  gmail = $1 "
    const res = await db.query(query, [username]);

    console.log('fetched user:', res.rows);
    return res.rows;

  } catch (err) {
    console.log("error in getting the password ", err.message)
  }


}


async function adduser(user) {
  try {

    const query = "INSERT INTO users(name,age,profile_pic,gmail,password,role) values($1,$2,$3,$4,$5,$6) RETURNING *  "
    const res = await db.query(query, [user.name, user.age, user.profile_pic, user.gmail, user.password, user.role])
    console.log("new user", res.rows[0])
    return res.rows[0]
  } catch (err) { console.error('Error adding user/seller:', err.message); }

}









async function getProduct(type) {
  try {
    const query = "SELECT * FROM products WHERE product_type=$1"; // fetch all products
    const res = await db.query(query, [type]);
    console.log("Products are:", res.rows); // .rows gives actual data
    return res.rows;
  } catch (error) {
    console.error("Error fetching products:", error.message);
  }
}




async function getfilteredproduct(value) {
  try {
    const query = "SELECT * FROM products WHERE product_price <=$1"; // fetch all products
    const res = await db.query(query, [value + 500]);
    console.log("Products are:", res.rows); // .rows gives actual data
    return res.rows;
  } catch (error) {
    console.error("Error fetching products:", error.message);
  }
}


async function addprofilepic(path, gmail) {
  try {
    const query = "UPDATE users SET profile_pic=$1 where gmail=$2 "
    const res = await db.query(query, [path, gmail])
    console.log(" done submitting the profile pic ")

  } catch (err) {
    console.log("error while uploading the image ", err)

  }
}

const getUserProfilePic = async (username) => {
  console.log("the getuserprfoile pic is hitting")
  const result = await db.query("SELECT profile_pic FROM users WHERE gmail = $1", [username]);
  console.log("profile pic getting ", result.rows[0])
  return result.rows[0]?.profile_pic || null;
};


async function getUser(gmail) {
  console.log("gmail in get usr ", gmail)
  const result = await db.query("SELECT * FROM users WHERE gmail = $1", [gmail]);
  console.log("user is  getting ", result.rows[0]);
  return result.rows[0] || "guest";
}




// Export functions for use in other modules
module.exports = {
  db,
  addcomment,
  getcomment,
  getCartItems,
  getPassword,
  adduser,
  getProduct,
  getfilteredproduct,
  addprofilepic,
  getUserProfilePic,
  getUser,
};
