const MongoClient = require('mongodb').MongoClient;

const config = require('../config');

let mongoDb = null;

module.exports.connect = async () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`, (err, db) => {
            if (err) {
                reject(err);
            } else {
                console.log("successfully connected to the database");
                mongoDb = db;
                resolve(db);
            }
            // db.close();
        });

    });

};

module.exports.getCollection = (collectionName) => {
    return mongoDb.collection(collectionName);
};
