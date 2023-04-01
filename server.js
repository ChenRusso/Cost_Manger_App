const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Cost Manager Application",
            version: "1.0.0",
            description: "A simple Express Library API",
        },
        servers: [
            {
                api: "http://localhost:8000/"
            }
            ]
    },
    apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs".toString(), swaggerUI.serve, swaggerUI.setup(specs));

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${process.env.PORT || 8000}`);
});

//'mongodb+srv://ChenRussoNodeJs:LianBar1@cluster1.dcd8xpg.mongodb.net/?retryWrites=true&w=majority'