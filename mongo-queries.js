var Q = require('q');
var Rx = require('rx-lite');
var db = require('./schema/index')
console.log('db === ', db)
var document = function () { }

module.exports = document

document.findOne = function (model, query, projection,  cb) {
    db[model].findOne(query, projection).exec(function (err, doc) {
        if (err) {
            cb(err, null)
        } else {
            cb(null, doc)
        }
    });
}
document.findOnePromise = Q.denodeify(document.findOne);

document.save = function (model, query, cb) {

    db[model].create(query, function (err, doc) {
        if (err) {
            cb(err, null)
        } else {
            cb(null, doc)
        }
    });
}

document.savePromise = Q.denodeify(document.save);


document.find = function (model, query, projection, cb) {
    console.log('query', query);
    db[model].find(query, projection).exec(function (err, docs) {
        console.log(err, docs)
        if (err) {
            cb(err, null)
        } else {
            cb(null, docs)
        }
    });
}

document.findPromise = Q.denodeify(document.find);


document.aggregation = function (model, query, cb) {
    console.log('query', query)
    db[model].aggregate(query).exec(function (err, docs) {
        if (err) {
            cb(err, null)
        } else {
            cb(null, docs)
        }
    });
}

document.aggregationPromise = Q.denodeify(document.aggregation);




document.findOneAndUpdate = function (model, query, doc, option, cb) {
    console.log('query', query)
    db[model].findOneAndUpdate(query, doc, option).exec(function (err, docs) {
        if (err) {
            cb(err, null)
        } else {
            cb(null, docs)
        }
    });
}

document.findOneAndUpdatePromise = Q.denodeify(document.findOneAndUpdate);


document.updateOne = function (model, query, doc, option, cb) {
    console.log('query', query);
    db[model].updateOne(query, doc, option).exec(function (err, docs) {
        console.log(err, docs)
        if (err) {
            cb(err, null)
        } else {
            cb(null, docs)
        }
    });
}

document.updateOnePromise = Q.denodeify(document.updateOne);