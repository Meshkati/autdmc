const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

axios.defaults.baseURL = "https://www.zarinpal.com/pg/rest/WebGate/";
const dbUrl = "mongodb://localhost:27017/scc-landing";

const prices = [60000, 90000, 120000, 150000]
const competitionPrice = 10000

/* GET api listing. */
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.get('/pay', (req, res) => {
    
    const data = {
        // "MerchantID": "b8f1b486-0ef1-11e6-8621-000c295eb8fc",
        "MerchandID": "2df8f514-8ae8-11e7-aa93-005056a205be",
        "CallbackURL": "http://autdmc.ir/api/pay/callback",
        "Amount": "1000",
        "Description": ""
    }
    
    paymentRequest(data)
    .then(authority => {
        const url = 'https://www.zarinpal.com/pg/StartPay/' + authority
        res.setHeader('Location', url);
        res.send(201, url);
    })
})

app.get('/pay/wcallback', (req, res) => {
    console.log(req.query)
    const authority = req.query['Authority'];
    const status = req.query['Status'];

    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err;

        db.collection('workshopUsers').update(
            {"authority": authority},
            {$set: {"payment_status": status}}, doc => {
                let data = {
                    status: status,
                    message: 'failed',
                    authority: authority,
                    data: doc
                }

                res.redirect('http://autdmc.ir/payment?authority=' + authority)
            })
    })
})

app.get('/pay/ccallback', (req, res) => {
    console.log(req.query)
    const authority = req.query['Authority'];
    const status = req.query['Status'];

    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err;

        db.collection('competitionTeams').update(
            {"authority": authority},
            {$set: {"payment_status": status}}, doc => {
                let data = {
                    status: status,
                    message: 'failed',
                    authority: authority,
                    data: doc
                }

                res.redirect('http://autdmc.ir/payment?authority=' + authority)
            })
    })
})

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
                db.collection('workshopUsers').find({'email': req.body['email']}).toArray((err, docs) => {
                    let resume = true;
                    if (docs.length == 1) {
                        if (docs[0]['payment_status'] == 'OK') {
                            resume = false
                            res.send('user exist');
                        }
                    }
                    if (resume) {
                        db.collection('workshopUsers').insert({
                            "email": req.body['email'],
                            "fname": req.body['fname'],
                            "lname": req.body['lname'],
                            "phone": req.body['phone'],
                            "items": req.body['items'],
                            "payment_mode": req.body['payment_mode'],
                            "authority": '',
                            "payment_status": '',
                            'amount': calculateAmount(req.body['items'], req.body['payment_mode'])
                        }, (err, newDoc) => {
                            if (!err) {
                                const payData = {
                                    "MerchantID": "2df8f514-8ae8-11e7-aa93-005056a205be",
                                    "CallbackURL": "http://autdmc.ir/api/pay/wcallback",
                                    "Amount": calculateAmount(req.body['items'], req.body['payment_mode']),
                                    "Description": req.body['email']
                                }
                                
                                paymentRequest(payData)
                                .then(authority => {
                                    if (authority) {
                                        db.collection('workshopUsers').update(
                                            {"email": req.body['email']},
                                            {$set: {"authority": authority}}, doc => {
                                                const url = 'https://www.zarinpal.com/pg/StartPay/' + authority;
                                                console.log(authority);
                                                const response = {
                                                    authority: authority,
                                                    url: url,
                                                    status: 200
                                                }
                                                res.send(response);
                                            })
                                    } else {
                                        db.collection('workshopUsers').remove({"_id": newDoc.insertedId}, (err, doc) => {
                                            console.log(doc.result);
                                            
                                            res.send('failed');
                                        });
                                    }
                                })
                            }
                        });
                    }
                })
            }
        }
    })
})

app.post('/workshop/getuser', (req, res) => {
    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err
        console.log(req.body);

        if (req.body['authority']) {

            db.collection('workshopUsers').find({
                "authority": req.body['authority']
            }).toArray((err,doc) => {
                if (err)
                    throw err

                res.send(doc[0])
            })

            db.collection('competitionTeams').find({
                "authority": req.body['authority']
            }).toArray((err, doc) => {
                if (err)
                    throw err
                
                responseData = {
                    fname: doc[0]['name'],
                    email: doc[0]['members'][0]['email'],
                    amount: doc[0]['amount'],
                    payment_status: doc[0]['payment_status']
                }
                res.send(responseData)
            })
        }
    })
})

app.post('/competition/register', (req, res) => {
    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err;

        console.log(req.body)

        const teamSize = req.body['num']
        const teamMembers = req.body['users']
        const teamName = req.body['team_name']

        if (teamSize < 6 && teamSize > 0) {
            /*teamMembers.forEach(element => {
                if (!element['email'] || !element['fname'] || !element['lname'] || !element['phone']) {
                    res.send('empty field');
                } else {
                    if (!validateEmail(req.body['email'])) {
                        res.send('invalid email');
                    }
                }
            })*/

            db.collection('competitionTeams').insert({
                "members": teamMembers,
                "size": teamSize,
                "name": teamName,
                "authority": '',
                "payment_status": '',
                "amount": competitionPrice
            }, (err, newDoc) => {
                if (!err) {
                    const payData = {
                        "MerchantID": "2df8f514-8ae8-11e7-aa93-005056a205be",
                        "CallbackURL": "http://autdmc.ir/api/pay/ccallback",
                        "Amount": competitionPrice,
                        "Description": teamName
                    }

                    const url = 'https://educenter.aut.ac.ir/autdmc';
                    const response = {
                        url: url,
                        status: 200
                    }
                    res.send(response);
                }
            })
        }
    })
})

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function paymentRequest(ops) {
    return axios.post('PaymentRequest.json', ops)
    .then( ({data}) => {
        if (data.Status == 100) {
            return data.Authority
        } else {
            console.log(data.status)
        }
    }).catch(console.error)
}

function verifyPayment(verificationCode) {
    return axios.post('PaymentVerification.json', verificationCode)
    .then( ({data}) => {
        return data;
    }).catch(console.error)
}

function calculateAmount(items, mode) {
    let amount = 0;
    items.forEach(element => {
        if (element) {
            amount += prices[mode]
        }
    })
    
    return amount.toString();
}

module.exports = app;