const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const db = require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const PORT = process.env.PORT || 3000;
const userSchema = require('./routes/userRoute')
const stockSchema = require('./routes/stockRoute')
const staticRoute = require('./routes/staticRoute')


app.set("view engine", "ejs")
app.set("views", path.resolve("./view"))


app.use('/', staticRoute)

app.use('/user', userSchema)
app.use('/dashboard', stockSchema)

  
app.listen(PORT, () => {
    console.log(`Example app listening on port 3000`)
})