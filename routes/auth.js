const express = require('express');
const jwt = require('jsonwebtoken');
const Rx = require('rx-lite');
const mongodb = require('../mongo-queries');
const isEmpty = require('is-empty');
const bcrypt = require('bcrypt');
const config = require('../config');

const app = express.Router();

app.post('/login', function (req, res) {
    console.log('req.body ', req.body);
    let username = req.body.username;
    let password = req.body.password;
    var token = ""

    Rx.Observable.fromPromise(mongodb.findOnePromise("user", { "username": req.body.username }, null)).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            token = jwt.sign({ username: username, id: document._id },
                config.secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            if (document.username == username && bcrypt.compareSync(password, document.password)) {
                return document;
            } else {
                Rx.Observable.of({})
            }
        }
    }).subscribe(function (result) {
        if (isEmpty(result)) {
            res.status(404).json({ "data": "user not exist" });
        } else {
            res.status(200).json({ "data": result, "token": token });
        }
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully login")
    })
});
app.post('/register', function (req, res) {
    console.log('req.body ', req.body)
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var newUser = {
        username: req.body.username,
        country: req.body.country,
        password: hashedPassword
    }
    var token = ""
    Rx.Observable.fromPromise(mongodb.findOnePromise("user", { "username": req.body.username }, null)).map(function (user) {
        if (isEmpty(user)) {
            var user = mongodb.savePromise("user", newUser)
            token = jwt.sign({ username: user.username, id: user._id },
                config.secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            return user
        } else {
            Rx.Observable.of({})
        }
    }).subscribe(function (result) {
        if (isEmpty(result)) {
            res.status(302).json({ "data": "user already exist" });
        } else {
            res.status(200).json({ "data": result, "token": token });
        }
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully login")
    })
});
module.exports = app;