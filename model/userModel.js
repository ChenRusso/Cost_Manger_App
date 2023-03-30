const mongoose = require("mongoose");

/**
 * This is  the user model
 * This is the fields that save in the db.
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}>}
 */
const usersSchema = new mongoose.Schema({
    personalId:String,
    first_name:String,
    last_name:String,
    birthday:String,
    marital_status:String,
    password:String
});
const UserController = mongoose.model('User', usersSchema);

module.exports = UserController;
