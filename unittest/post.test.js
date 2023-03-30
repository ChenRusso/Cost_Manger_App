const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const userModel = require('../model/userModel')

const personalId = '123'
const first_name = 'Test'
const last_name = 'User'
const birthday = '1995-01-01'
const marital_status = 'Married'
const password = 'password'

beforeAll(done => {
    userModel.deleteMany({}, (err) => {
        done()
    })
})

afterAll(done => {
    userModel.deleteMany({}, (err) => {
        app.close();
        mongoose.connection.close()
        done()
    })
})

describe('Testing User API', () => {
    let accessToken = ''

    test('add new user', async () => {
        const response = await request(app).post('/user').set({authorization: 'JWT ' + accessToken})
            .send({
                'personalId': personalId,
                'first_name': first_name,
                'last_name': last_name,
                'birthday': birthday,
                'marital_status': marital_status,
                'password': password
            })
        expect(response.statusCode).toEqual(200)

        const newUser = response.body
        expect(newUser.personalId).toEqual(personalId)
        expect(newUser.first_name).toEqual(first_name)
        expect(newUser.last_name).toEqual(last_name)
        expect(newUser.birthday).toEqual(birthday)
        expect(newUser.marital_status).toEqual(marital_status)

        const response2 = await request(app).get('/user/' + newUser.personalId)
            .set({authorization: 'JWT ' + accessToken})
        expect(response2.statusCode).toEqual(200)
        const user2 = response2.body
        expect(user2.personalId).toEqual(personalId)
        expect(user2.first_name).toEqual(first_name)
        expect(user2.last_name).toEqual(last_name)
        expect(user2.birthday).toEqual(birthday)
        expect(user2.marital_status).toEqual(marital_status)
    })

    test('get users', async () => {
        const response = await request(app).get('/user').set({authorization: 'JWT ' + accessToken})
        expect(response.statusCode).toEqual(200)
        const users = response.body
        expect(users.length).toEqual(1)
    })

    test('edit user', async () => {
        const response = await request(app).put('/user/' + personalId).set({authorization: 'JWT ' + accessToken})
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
})