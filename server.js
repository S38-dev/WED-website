const express = require("express");
const ejs= require("ejs");
const app = express()
app.set("view engine","ejs")
app.use(express.static('pubic'))

