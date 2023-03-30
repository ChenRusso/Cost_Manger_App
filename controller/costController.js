/**
 * costModel Request Controller.
 */

const costModel = require("../model/costModel");
const CostAverageModel = require("../model/costAverageModel");
const mongoose = require("mongoose");

let currentExpensesAverage = 5;
let prevTotalSum = 0;

/**
 * This method is reset all the costs in the mongoDB
 * This method use for testing.
 * @param req request param
 * @param res response param
 * @returns {Promise<void>}  return fail or success
 */
const resetCosts = async (req, res) => {
    try {
        // extract params from the url.
        const {userId} = req.params;
        // delete all the costs for restart the db.
        await costModel.deleteMany({userId});

        // send OK status for the user
        res.status(205).json('Reset done!');
    } catch (e) {
        // send error status for the user
        res.status(500).json(e);
    }
};

/**
 * This method gets all the costs from the mongoDB
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const getCosts = async (req, res) => {
    try {
        // extract params from the url.
        const {userId} = req.params;
        // get all the costs form the db.
        const costs = await costModel.find({userId});

        // if the costs is not null:
        if (costs) {
            // send OK status for the user.
            res.status(200).send(costs);
        } else {
            // send 204 status for the user.
            res.status(204).json('No costs');
        }
    }
    catch (e){
        // send error status for the user.
        res.status(500).json(e);
    }
};

/**
 * This method get full report by start month and end month
 * return all the costs between the dates
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const getCostsReport = async (req, res) => {
    try {
        //extract params from the url.
        const {fromDate, toDate} = req.params;
        // get report for the user from date to date the user choose.
        const costs = await costModel.find({date: {$gte: fromDate, $lt: toDate}});

        // if the costs not null:
        if (costs) {
            // send OK status for the user.
            res.status(200).send(costs);
        } else {
            // send 204 error status for the user.
            res.status(204).json('No costs');
        }
    }
    catch (e){
        // send error status for the user.
        res.status(500).json(e);
    }
};

/**
 * This method update spcific cost.
 * The update is transfer in the body of the request.
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const updateCost = async (req, res) => {
    try {
        // extract params form the url
        const {costId} = req.params;
        // extract params from the body.
        const {description, sum, category, userId, date} = req.body;
        // update the cost from the params that the user send in the body.
        await costModel.updateOne({_id: costId}, {description, sum, category, userId, date}); //.exec();

        // get the updated cost from the db.
        const updatedCost = await costModel.find({_id: costId});

        // send OK status for the user with the updated cost.
        res.status(200).json(updatedCost);
    }
    catch (e){
        // send error status for the user.
        res.status(500).json(e);
    }
};

/**
 * This method is deleting cost the id of the cost transfer in the url.
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const deleteCost = async (req, res) => {
    try {
        // extract params form the url.
        const {costId} = req.params;
        // delete the cost id that the user choose from the db.
        await costModel.deleteOne({_id: costId});//.exec();

        // send OK status to the user.
        res.status(200).json("OK!");
    }
    catch (e){
        // send error status for the user.
        res.status(500).json(e);
    }
};

/**
 * This method add new cost to the db
 * All the information about the cost is transfer in the body.
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const newCost = async (req, res) => {
    try {
        // extract params form the body.
        const {description, sum, category, userId, date} = req.body;
        const newCost =
            new costModel({description, sum, category, userId, date});

        // update the average db with the new cost.
        await expensesComputedAverage(date, sum, userId);

        // save the new cost in the db.
        newCost.save((err, newCost) => {
            // send the OK status for the user.
            res.status(201).json(newCost);
        })
    }
    catch (e){
        // send error message for the user.
        res.status(500).json(e);
    }
};

/**
 * This method Calculate the total expenses average.
 * This method using the Approximation Pattern.
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const expensesApproximationAverage = async (req, res) => {
    try {
        // Approximation average
        if (currentExpensesAverage === 5) {
            // extract params form the url.
            const {userId} = req.params;

            // find the costs the user choose
            let costs = await costModel.find({userId});
            let totalSum = 0;
            costs = JSON.parse(JSON.stringify(costs));

            // if the costs is not null:
            if (costs) {
                totalSum = 0;
                // calculate the total sum from the db.
                for (let i = 0; i < costs.length; i++) {
                    totalSum += costs[i].sum;
                }

                // calculate the average.
                totalSum = totalSum / costs.length;
                currentExpensesAverage = 0;
                prevTotalSum = totalSum;

                // send OK status for the user.
                res.status(200).json(totalSum);

            } else {
                // send 204 status for the user.
                currentExpensesAverage = 0;
                res.status(204).json('No costs');
            }
        } else {
            // send OK status for the user.
            currentExpensesAverage++;
            res.status(200).json(prevTotalSum);
        }
    }
    catch (e){
        // send error status for the user.
        res.status(500).json(e);
    }
};

/**
 * This method Calculate the total expenses average.
 * This method using the Computed Pattern.
 * @param date
 * @param sumToAdd
 * @returns {Promise<void>} return fail or success
 */
const expensesComputedAverage = async (date, sumToAdd, userId) => {

    try {
        // format the date in string to date object.
        date = new Date(date);
        const month = date.getMonth();
        const year = date.getFullYear();
        // find the cost average.
        const averageRow = await CostAverageModel.findOne({$and : [{month}, {year},{userId}]});

        // if the result from the db is not null:
        if(averageRow !== null){
            // update the current average with the new cost.
            const count = averageRow.count +1;
            const sum = averageRow.sum + sumToAdd;
            const average = sum / count;
            await CostAverageModel.updateOne({_id: averageRow._id}, {sum, count,average}); //.exec();
        }
        else{
            // add the cost to the db.
            const count = 1;
            const sum = sumToAdd;
            const average = sum;
            const newComputedAverage =
                new CostAverageModel({sum, count,average, month, year,userId });

            newComputedAverage.save();
        }
    }
    catch (e){
        // if error occur then send error status for the user.
        return res.status(500).json(e);
    }
};

/**
 * This method gets all the costs averages from the mongoDB
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} return fail or success
 */
const getExpensesComputedAverage = async (req, res) => {
    try {
        // extract params from the url.
        const {userId} = req.params;

        // find all the costs average of the current user.
        const costsAverage = await CostAverageModel.find({userId});

        if (costsAverage) {
            // send OK status for the user.
            res.status(200).send(costsAverage);
        } else {
            // send 204 status for the user.
            res.status(204).json('No costs');
        }
    }
    catch (e){
        // send error status for the user.
        res.status(500).json(e);
    }
};

module.exports = {newCost, resetCosts, getCosts, getCostsReport, updateCost, deleteCost, expensesApproximationAverage,getExpensesComputedAverage};