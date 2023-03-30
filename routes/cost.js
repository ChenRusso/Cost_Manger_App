const express = require('express'); //import express

const router  = express.Router();

const costController = require('../controller/costController');

/**
 * This is route for the cost Controller
 * This route had all the CRUD api.
 */

/**
 * @swagger
 * tags:
 *   name: Costs
 *   description: API for managing costs.
 */


router.get('/resetCost/:userId', costController.resetCosts);

/**
 * @swagger
 * /resetCost/{userId}:
 *   delete:
 *     summary: Deletes all costs for a given user ID.
 *     tags: [Cost API]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose costs will be reset.
 *     responses:
 *       '205':
 *         description: Reset done.
 *       '500':
 *         description: Internal Server Error.
 */


router.get('/average/:userId', costController.getExpensesComputedAverage);

/**
 * @swagger
 * /api/costs/average/{userId}:
 *   get:
 *     summary: Get the computed average expenses for a user.
 *     description: Retrieve the computed average expenses for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user for whom to retrieve the computed average expenses.
 *     responses:
 *       200:
 *         description: An array of objects containing the computed average expenses for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the computed average expenses.
 *                   userId:
 *                     type: string
 *                     description: The ID of the user for whom the computed average expenses are being retrieved.
 *                   average:
 *                     type: number
 *                     description: The computed average expenses for the user.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time at which the computed average expenses were created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time at which the computed average expenses were last updated.
 *       204:
 *         description: No computed average expenses were found for the user.
 *       500:
 *         description: An error occurred while retrieving the computed average expenses for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message describing the error that occurred.
 *                 error:
 *                   type: object
 *                   description: The error object returned by the database.
 */


router.get('/:userId', costController.getCosts);


/**
 * @swagger
 * /expenses/{userId}:
 *   get:
 *     summary: Get all cost entries for a user.
 *     tags: [Costs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose cost entries should be retrieved.
 *     responses:
 *       200:
 *         description: The retrieved cost entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cost'
 *       404:
 *         description: The specified user could not be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An internal server error occurred while retrieving the cost entries.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/report/:fromDate/:toDate', costController.getCostsReport);

/**
 * @swagger
 * /report/{fromDate}/{toDate}:
 *   get:
 *     summary: Get costs report for a given date range
 *     description: Returns a list of costs for a given date range
 *     tags:
 *       - Cost API
 *     parameters:
 *       - in: path
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *         description: The starting date for the report (in format YYYY-MM-DD)
 *       - in: path
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *         description: The ending date for the report (in format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: A list of costs for the given date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cost'
 *       204:
 *         description: No costs found for the given date range
 *       500:
 *         description: Server error
 */


router.get('/expensesApproximationAverage/:userId', costController.expensesApproximationAverage);

/**
 * @swagger
 * /expensesApproximationAverage/{userId}:
 *   get:
 *     summary: Get an approximation of the average expenses of a user
 *     tags: [Cost API]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user whose expenses to calculate
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               description: Approximated average of the user's expenses
 *       '204':
 *         description: No content
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Error details
 */


router.put('/update/:costId', costController.updateCost);

/**
 * @swagger
 * /expenses/update/{costId}:
 *   put:
 *     summary: Update a cost entry.
 *     tags: [Costs]
 *     parameters:
 *       - in: path
 *         name: costId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cost entry to update.
 *       - in: body
 *         name: cost
 *         description: The cost entry to update.
 *         schema:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *             sum:
 *               type: number
 *             category:
 *               type: string
 *             userId:
 *               type: string
 *             date:
 *               type: string
 *         required:
 *           - description
 *           - sum
 *           - category
 *           - userId
 *     responses:
 *       200:
 *         description: The updated cost entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cost'
 *       404:
 *         description: The specified cost entry could not be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An internal server error occurred while updating the cost entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


router.delete('/delete/:costId', costController.deleteCost);

/**
 * @swagger
 * /expenses/delete/{costId}:
 *   delete:
 *     summary: Delete a cost entry by ID.
 *     tags: [Costs]
 *     parameters:
 *       - in: path
 *         name: costId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cost entry to delete.
 *     responses:
 *       200:
 *         description: The deleted cost entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cost'
 *       404:
 *         description: The specified cost entry could not be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An internal server error occurred while deleting the cost entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


router.post('/add', costController.newCost);

module.exports = router;



/*
/expenses
router.get('/:userId', costController.getCosts);
router.put('/:costId', costController.updateCost);
router.get('', costController.getAll);


GET -> /:ID
get -> getAll -> ''
PUT -> /:id -> BODY
DELETE -> /:ID
 */
