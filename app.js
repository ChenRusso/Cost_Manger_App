/**
 * This file combines all the existing controllers
 * in the system and creates an application.
 */
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// import all the routes
const ConstRoute = require('./routes/cost');
const UserRoute = require('./routes/user');
const CategoryRoute = require('./routes/category');


app.use(express.json());
// part of the url of the routes
app.use('/category', CategoryRoute);
app.use('/user', UserRoute);
app.use('/cost', ConstRoute);

// connection to mongoose
const url = process.env.MongoDB_URL || 'mongodb://localhost:27017';

(async () => {
    console.log(url);
    const db = await mongoose.connect(url);
})().catch(err => console.log(err));

// Listen in port 8000
app.listen(process.env.PORT || 8000, () => {
    console.log("The app is on listen...");
});

module.exports = app;
