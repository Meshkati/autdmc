const express = require('express');
const mongo = require('mongodb');
const app = express();
const bodyParser = require('body-parser');


const mongoClient = mongo.MongoClient;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

