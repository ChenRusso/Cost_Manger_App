const mongoose = require('mongoose');

/**
 * This is  the cost model
 * This is the fields that save in the db.
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}>}
 */
const costSchema = new mongoose.Schema({
    description:String,
    sum:Number,
    date:Date,
    category:String,
    userId:String
});
const CostController = mongoose.model('Cost', costSchema);

module.exports = CostController;
