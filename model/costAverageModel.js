const mongoose = require('mongoose');

/**
 * This is  the cost average model
 * This is the fields that save in the db.
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}>}
 */
const costAverageSchema = new mongoose.Schema({
    sum:Number,
    count:Number,
    average:Number,
    month:Number,
    year:Number,
    userId:String
});
const CostAverageModel = mongoose.model('CostAverage', costAverageSchema);

module.exports = CostAverageModel;
