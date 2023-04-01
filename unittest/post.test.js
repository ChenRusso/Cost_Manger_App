const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const userModel = require('../model/userModel')
const {Model} = require("mongoose");
const costModel = require('../model/costModel')

const personalId = '88'
const first_name = 'Test'
const last_name = 'User'
const birthday = '1995-01-01'
const marital_status = 'Married'
const password = 'password'

beforeEach(async () => {
    await mongoose.connection.createCollection('testCollection');
});

afterEach(async () => {
    await mongoose.connection.dropCollection('testCollection');
});

describe('Testing User API', () => {
    let accessToken = ''

    test('get users', async () => {
        const response = await request(app).get('/user').set({authorization: 'JWT ' + accessToken})
        expect(response.statusCode).toEqual(200)
        const users = response.body
        expect(users.length).toEqual(6)
    })

    test('edit user', async () => {
        const response = await request(app).put('/user/update/' + personalId).set({authorization: 'JWT ' + accessToken})
            .send({
                'personalId': personalId,
                'first_name': 'New Test',
                'last_name': 'User',
                'birthday': '1995-01-02',
                'marital_status': 'Single',
                'password': password
            })
        expect(response.statusCode).toEqual(201)
        const updatedUser = response.body
        expect(updatedUser.personalId).toEqual(personalId)
        expect(updatedUser.first_name).toEqual('New Test')
        expect(updatedUser.last_name).toEqual(last_name)
        expect(updatedUser.birthday).toEqual('1995-01-02')
        expect(updatedUser.marital_status).toEqual('Single')
    })


    test('update cost', async () => {
        // create a new cost in the database
        const newCost = await costModel.create({
            description: 'Test cost',
            sum: 50,
            category: 'Test category',
            userId: 'test-user-id',
            date: '2022-04-01'
        })

        // send a request to update the cost with new values
        const response = await request(app)
            .put(`/cost/update/${newCost._id}`)
            .set({ authorization: 'JWT ' + accessToken })
            .send({
                description: 'Updated test cost',
                sum: 75,
                category: 'Updated test category',
                userId: 'updated-test-user-id',
                date: '2022-04-02'
            })

        // assert that the response status code is 200
        expect(response.statusCode).toEqual(200)

        // assert that the response body is an array with one updated cost object
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toEqual(1)

        // assert that the updated cost object has the expected values
        const updatedCost = response.body[0]
        expect(updatedCost.description).toEqual('Updated test cost')
        expect(updatedCost.sum).toEqual(75)
        expect(updatedCost.category).toEqual('Updated test category')
        expect(updatedCost.userId).toEqual('updated-test-user-id')
        expect(new Date(updatedCost.date)).toEqual(new Date('2022-04-02'))
    })


})