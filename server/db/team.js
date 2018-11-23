const getCollection = require('./db').getCollection;

module.exports.newTeam = async teamObject => {
    return new Promise((resolve, reject) => {
        teamObject.validated = false;
        getCollection('teams').insertOne(teamObject, (err, r) => {
            if (err)
                reject(err);
            resolve(r);
        });
    });
};

module.exports.getAllTeams = async () => {
    return new Promise((resolve, reject) => {
        getCollection('teams').find({}).toArray( (err, r) => {
            r.map(x => x.password = undefined);
            if (err)
                reject(err);
            resolve(r);
        });
    });
};
