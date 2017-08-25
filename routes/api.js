const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const app = express();
const bodyParser = require('body-parser');


const dbUrl = "mongodb://localhost:27017/scc-landing";

/* GET api listing. */
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

app.post('/workshop/register', (req, res) => {
    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err;
        
        console.log(req.body);

        if (!req.body['email'] || !req.body['fname'] || !req.body['lname'] || !req.body['phone']) {
            res.send('empty field');
        } else {
            if (!validateEmail(req.body['email'])) {
                res.send('invalid email');
            } else {
                db.collection('workshopUsers').find({'email': req.body['email']}).count((err, emailNumber) => {
                    if (emailNumber != 0) {
                        res.send('user exist');
                    } else {
                        db.collection('workshopUsers').insert({
                            "email": req.body['email'],
                            "fname": req.body['fname'],
                            "lname": req.body['lname'],
                            "phone": req.body['phone']
                        }, (err, newDoc) => {
                            res.send(newDoc.ops)
                        });
                    }
                })
            }
        }
    })
})

module.exports = app;