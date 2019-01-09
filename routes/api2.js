const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const mongoClient = Mongo.MongoClient;

// consts
const dbUrl = "mongodb://localhost:27017/scc-landing";

var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function setupDB() {
    mongoose.connect(dbUrl);
    db = mongoose.connection;
}

app.post('/auth/register', (req, res) => {
    setupDB();
    // Validating the request
    


    db.on('error', console.error.bind("Database connection error:"));
    db.once('open', () => {

    })
});