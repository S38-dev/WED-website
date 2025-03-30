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
  const query = 'SELECT user_id , comment  FROM comment';
  try {
    const res = await db.query(query);
    console.log('Fetched comments:', res.rows);
    return res.rows; // Return the fetched comments
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    throw error;
  }
}



// Export functions for use in other modules
module.exports = {
  addcomment,
  getcomment,
};
