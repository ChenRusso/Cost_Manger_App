/**
 * userModel Request Controller.
 */
const userModel = require("../model/userModel");
const UserController = require("../model/userModel");

/**
 * This method, adds a new user.
 * @param req request param.
 * @param res response param.
 * @returns {Promise<void>} failed or success.
 */
const newUser = async (req, res) => {
    try {
        //extract field from the request body.
        const {personalId, first_name, last_name, birthday, marital_status, password
        } = req.body;

        // check if the user exists.
        if (await isUserExists(personalId,res))
        {
            res.status(409).json("User already exists!");
            return;
        }
        const newUser =
            new userModel({personalId, first_name, last_name, birthday, marital_status, password});

        // create and save new user.
        const result = await UserController.create(req.body);
        res.status(201).json(result);
    }
    catch (e)
    {
        console.log(e)
        res.status(500).json(e);
    }
};

/**
 * This method returns all existing users in the database.
 * @param req request param.
 * @param res response param.
 * @returns {Promise<void>} failed or success.
 */

const getUsers = async (req, res) =>
{
    try {
        // find all users from db.
        const users = await userModel.find({});

        if (users)
        {
            res.status(200).send(users);
        }
        else
        {
            res.status(204).json('No users to retrieve');
        }
    }
    catch (e)
    {
        res.status(500).json(e);
    }
};

/**
 * This method resets all users that is in the database.
 * @param req request param.
 * @param res response param.
 * @returns {Promise<void>} failed or success.
 */
const resetUsers = async (req, res) => {
    try {
        // delete all date in db.
        await userModel.deleteMany({});
        const initUser = [
            { personalId:"123",
                first_name:"Bar",
                password:"24041999",
                last_name:"Russo",
                birthday:"16.8.1997",
                marital_status:"Single",
            }
        ]

        // insert default value after the reset.
        await userModel.insertMany(initUser);

        res.status(205).json('Reset done!');
    }
    catch (e)
    {
        res.status(500).json(e);
    }
};

/**
 * This method, edits an existing user.
 * @param req request param.
 * @param res response param.
 * @returns {Promise<void>} failed or success.
 */
const putUser = async (req, res) => {
    try {
        //extract field from the request params.
        const {personalId} = req.params;
        //extract field from the request body.
        const {
            first_name, last_name,
            birthday, marital_status, password
        } = req.body;

        // check if user is not exists.
        if (! (await isUserExists(personalId,res)))
        {
            res.status(409).json("User not exists!");
            return;
        }

        // update the user.
        await userModel.updateOne({personalId},
            {personalId, first_name, last_name, birthday, marital_status, password}); //.exec();

        const updatedUser = await userModel.findOne({personalId});

        res.status(201).json(updatedUser);
    }
    catch (e)
    {
        res.status(500).json(e);
    }
};

/**
 * This method deletes an existing user.
 * @param req request param.
 * @param res response param.
 * @returns {Promise<void>} failed or success.
 */
const deleteUser = async (req, res) => {
    try{
        //extract field from the request params.
        const { personalId } = req.params;

        await userModel.deleteOne({personalId });//.exec();

        res.status(200).json("OK!");
    }
    catch (e) {
        res.status(500).json(e);
    }
};

/**
 * This method check if the user is exists and the password is right
 * This method is for the login page.
 * @param req request param
 * @param res response param
 * @returns {Promise<void>} failed or success
 */
const login = async (req,res) => {

    try{
        //extract field from the request body.
        const { personalId ,password} = req.body;

        let isUserExists = await userModel.findOne({personalId});


        // if the user is not exists
        if (isUserExists == null) {
            res.status(404).json("user does not exists");
            return;
        }

        // if the password is not right
        if (isUserExists.password !== password)
        {
            res.status(401).json("User or password not valid");
            return;
        }

        res.status(200).json("OK!");
    }
    catch (e) {
        res.status(500).json(e);
    }
}

const isUserExists = async (personalId) =>
{
    let userToFind = await userModel.findOne({personalId});

    return userToFind !== null;

}

module.exports = {login, newUser, resetUsers, getUsers, putUser, deleteUser};