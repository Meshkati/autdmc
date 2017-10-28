const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload')

axios.defaults.baseURL = "https://www.zarinpal.com/pg/rest/WebGate/";
const dbUrl = "mongodb://localhost:27017/scc-landing";

const prices = [60000, 90000, 120000, 150000]
const competitionPrice = 10000
const secret = 'Zr9sEPw^cysG8xz'

// Error codes:
// 1001 --> fill all the inputs
// 1002 --> team name exists
// 1003 --> user is already in team

// 2001 --> empty field
// 2002 --> user not found
// 2003 --> wrong password
/* GET api listing. */
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}))

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
    res.send('ended')

    if (false) {
    let response
    const teamSize = req.body['num']
    const teamMembers = req.body['users']
    const teamName = req.body['team_name'].replace(/\s\s+/g, ' ').trim().toLowerCase();
    let isValid = true

    teamMembers.forEach(element => {
        console.log(element)
        if (element['fname'] == '' || element['lname'] == '' || !validateEmail(element['email'])) {
            console.log('falsed')
            isValid = false
        }
    })

    if (!isValid) {
        console.log('failed')
        response = {
            status: 1001
        }
        res.send(response)
    } else {
        mongoClient.connect(dbUrl, (err, db) => {
            if (err)
                throw err;
            // check team name
            db.collection('competitionTeams').find({name: teamName}).count()
            .then(num => {
                if (num != 0) {
                    response = {
                        status: 1002
                    }
                    res.send(response)
                } else {
                    teamMembers.forEach(element => {
                        db.collection('competitionTeams').findOne({'members.email': element['email']})
                        .then((eUser) => {
                            if (eUser) {
                                response = {
                                    status: 1003,
                                    data: element['email']
                                }
                                isValid = false
                                res.send(response)
                            }
                        })
                        .then(() => {
                            if (isValid) {
                                if (teamSize < 6 && teamSize > 0) {
                                    db.collection('competitionTeams').insert({
                                        "members": teamMembers,
                                        "size": teamSize,
                                        "name": teamName,
                                        "authority": '',
                                        "payment_status": '',
                                        "amount": competitionPrice
                                    }, (err, newDoc) => {
                                        if (!err) {            
                                            const url = 'https://educenter.aut.ac.ir/autdmc';
                                            response = {
                                                url: url,
                                                status: 200
                                            }
                                            res.send(response);
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            })
            
        })
    }
}
})

app.post('/panel/getCompetition', (req, res) => {

    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err

        const username = req.body['username']
        const password = req.body['password']
        
        if (username == null || username == undefined || password == null || username == undefined) {
            res.send('failed')
        } else {
            db.collection('admin').findOne({username: username})
            .then(doc => {
                if (doc == null) {
                    res.send('failed')
                }
                console.log(doc)
                if(bcrypt.compareSync(password, doc.password)) {
                    db.collection('competitionTeams').find({}).toArray()
                    .then(teams => {
                        db.collection('submittions').find({}).toArray()
                        .then(submittions => {
                            const resData = {
                                teams: teams,
                                submittions: submittions
                            }

                            res.send(resData)
                        })
                    }) 
                } else {
                    res.send('failed')
                }
            })
        }
    })
})

app.post('/login', (req, res) => {
    const username = req.body['username']
    const password = req.body['password']

    if (username == null || username == undefined || password == null || password == undefined) {
        const response = {
            status: 2001
        }

        res.send(response)
    } else {
        mongoClient.connect(dbUrl, (err, db) => {
            if (err)
                throw err
            
            db.collection('teams').findOne({username: username})
            .then(doc => {
                if (doc == null) {
                    const response = {
                        status: 2002
                    }
                    res.send(response)
                } else {
                    if (bcrypt.compareSync(password, doc.password)) {
                        let token = jwt.sign({user: doc.name}, secret);
                        const team = {
                            name: doc.name,
                            username: doc.username,
                            members: doc.members
                        }
                        const response = {
                            status: 200,
                            user: team,
                            verification: doc.verification,
                            token: token
                        }

                        res.send(response)
                    } else {
                        const response = {
                            status: 2003
                        }

                        res.send(response)
                    }
                }
            })
        })
    }
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


app.post('/getData', (req, res) => {
    const decoded = jwt.decode(req.body['token'])
    const filesName = req.body['file']

    mongoClient.connect(dbUrl, (err, db) => {
        if (err)
            throw err

        db.collection('downloads').insert({decoded: decoded, file: filesName})

        res.send(200)
    })
})

app.get('/getData', (req, res) => {
    const filesName = req.query['file']
    if (filesName == 'AUT DMC 2017 - Task.pdf' || filesName == 'AUT DMC 2017 - Features.pdf' || filesName == 'data_v2.zip'){
        res.download('files/' + filesName)
    } else {
        res.send('failed')
    }

})

app.get('/submittion/upload', (req, res) => {
    res.end('For submittion :)')
})

app.post('/submittion/upload', (req, res) => {
    let files = req.files;
    const token = req.headers.authorization
    const decoded = jwt.decode(token)
    console.log(decoded)
    res.end('expired')
    // if (files !== undefined && files !== null) {
    //     console.log(req.files.file)
    //     const fileName = token + '__' + Date.now() + '__' + req.files.file.name
    //     req.files.file.mv('./subs/upload/files/' + fileName, (err) => {
    //         console.log('START')
    //         console.error(err)
    //         if (err) {
    //             res.status(500)
    //         } else {
    //             mongoClient.connect(dbUrl, (err, db) => {
    //                 if (err)
    //                     throw err

    //                 db.collection('submittions').insert({user: decoded['user'], uploadTime: Date.now(), fileName: req.files.file.name})
    //             })
    //             console.log('File uploaded')
    //             res.end('File uploaded')
    //         }
    //     })
    // }
})

app.post('/submittion/getHistory', (req, res) => {
    const token = req.body['token']
    const decoded = jwt.decode(token)

    if (!(decoded == undefined || decoded == null)) {
        mongoClient.connect(dbUrl, (err, db) => {
            db.collection('submittions').find({user: decoded['user']}).toArray((err, docs) => {
    
                res.send(docs)
            })
        })
    }
})

module.exports = app;