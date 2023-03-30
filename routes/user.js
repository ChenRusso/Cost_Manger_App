const express = require('express'); //import express

const router  = express.Router();

const userController = require('../controller/userController');

/**
 * This is route for the user Controller
 * This route has all the CRUD API.
 */

/**
 * @swagger
 * tags:
 *   name: User Api
 *   description: The User API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - personalId
 *         - first_name
 *         - last_name
 *         - birthday
 *         - marital_status
 *         - password
 *       properties:
 *         personalId:
 *           type: string
 *           description : The user personal ID
 *           example: "123"
 *         first_name:
 *           type: string
 *           description : The user's first name
 *           example: "Bar"
 *         last_name:
 *           type: string
 *           description : The user's last name
 *           example: "Russo"
 *         birthday:
 *           type: string
 *           description : The user's date of birth
 *           example: "16.8.1997"
 *         marital_status:
 *           type: string
 *           description : The user's marital status
 *           example: "Single"
 *         password:
 *           type: string
 *           description : The user's password
 *           example: "24041999"
 */



/**
 * @swagger
 * /user/resetUsers:
 *   get:
 *     summary: Reset Users
 *     tags: [User Api]
 *     parameters:
 *       - in: query
 *         name: resetUsers
 *         schema:
 *           type: boolean
 *         required: true
 *         description: A boolean indicating whether to reset the users
 *     responses:
 *       200:
 *         description: The users have been reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users have been reset"
 */

router.get('/resetUsers', userController.resetUsers);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User Api]
 *     responses:
 *       200:
 *         description: The users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get('', userController.getUsers);


/**
 * @swagger
 * paths:
 *   /login:
 *     post:
 *       summary: Log in a user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: The email address of the user
 *                 password:
 *                   type: string
 *                   description: The password of the user
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: A JWT token for authentication
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal Server Error
 */

router.post('/login',userController.login);

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Create a new user
 *     description: Use this endpoint to create a new user
 *     requestBody:
 *       description: User object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. Authentication credentials are missing or invalid.
 *       500:
 *         description: Internal server error. Failed to create a new user.
 */

router.post('/add', userController.newUser);


router.put('/update/:personalId', userController.putUser);

/**
 * @swagger
 * /update/{personalId}:
 *   put:
 *     summary: Update user by personal ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: personalId
 *         required: true
 *         description: The user's personal ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User object to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid request body or personal ID
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

router.delete('/delete/:personalId', userController.deleteUser);
/**
 * @swagger
 * /delete/{personalId}:
 *   delete:
 *     summary: Delete a user by personal ID
 *     description: Deletes a user with the specified personal ID from the database.
 *     parameters:
 *       - in: path
 *         name: personalId
 *         schema:
 *           type: string
 *         required: true
 *         description: The personal ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */


module.exports = router;