const express = require("express");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");

const router = require("./router/router"); // Import router
app.use("/", router); // Use router 


app.use(express.static("public")); // Fix typo from "pubic" to "public"



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
