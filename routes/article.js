const express = require('express');
const app = express();
const Rx = require('rx-lite');
const mongodb = require('../mongo-queries');
const isEmpty = require('is-empty');
const config = require('../config');
const mongoose = require('mongoose');


var createArticle = function (req, res) {
    console.log("req.body ==== ", req.body);
    Rx.Observable.fromPromise(mongodb.savePromise("article", req.body)).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return document;
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully created")
    })
}
var listAllArticle = function (req, res) {
    Rx.Observable.fromPromise(mongodb.findPromise('article', {}, null)).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return document;
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully list all")
    })
}

var listArticle = function (req, res) {
    if (isEmpty(req.body.id)) return res.status(404).json({ "error": "user id expected" })
    if (req.userId != req.body.id) return res.status(401).json({ "error": "Unauthorized user" });
    Rx.Observable.fromPromise(mongodb.findPromise('article', { "user_id": req.body.id }, null)).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
            // return mongodb.findOnePromise('article', { "_id": req.body.article_id }, { "comments": { $elemMatch: { "_id": mongoose.Types.ObjectId(req.body.comment_id) } } })
        } else {
            return document;
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully list all")
    })
}


var addComment = function (req, res) {
    // if (req.userId != req.body.user_id) return res.status(401).json({ "error": "Unauthorized user" });
    let newComment = {
        "_id": mongoose.Types.ObjectId(),
        "text": req.body.text || "",
        "article_id": req.body.article_id || "",
        "user_id": req.body.user_id || "",
        "created_date": new Date(),
        "updated_date": new Date(),
        "like": []
    }

    Rx.Observable.fromPromise(mongodb.findOneAndUpdatePromise('article', { "_id": req.body.article_id }, { $push: { comments: newComment } }, { new: true, upsert: false })).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return document
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully add new comment")
    })
}

var commentLike = function (req, res) {
    // if (req.userId != req.body.user_id) return res.status(401).json({ "error": "Unauthorized user" });
    let likeWise = {
        "_id": mongoose.Types.ObjectId(),
        "article_id": req.body.article_id || "",
        "comment_id": req.body.comment_id || "",
        "user_id": req.body.user_id || "",
        "created_date": new Date(),
        "updated_date": new Date()
    }
    Rx.Observable.fromPromise(mongodb.findOnePromise('article', { "_id": req.body.article_id }, { "comments": { $elemMatch: { "_id": mongoose.Types.ObjectId(req.body.comment_id) } } })).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return mongodb.updateOnePromise("article", { "_id": req.body.article_id, "comments": { $elemMatch: { "_id": mongoose.Types.ObjectId(req.body.comment_id) } } }, { $push: { "comments.$.like": likeWise } }, null)
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully added like")
    })
}

var shareArticle = function (req, res) {
    // if (req.userId != req.body.share_id) return res.status(401).json({ "error": "Unauthorized user" });
    var shareDetails = {
        "_id": mongoose.Types.ObjectId(),
        "article_id": req.body.article_id || "",
        "user_id": req.body.user_id || "",
        "share_id": req.body.share_id || "",
        "test": req.body.text || "",
        "created_date": new Date(),
        "updated_date": new Date()
    }

    Rx.Observable.fromPromise(mongodb.findOneAndUpdatePromise('article', { "_id": req.body.article_id }, { $push: { share: shareDetails } }, { new: true, upsert: false })).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return document
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully new shared")
    })
}

var listSharedArticle = function (req, res) {
    if (isEmpty(req.body.id)) return res.status(404).json({ "error": "user id expected" })
    // if (req.userId != req.body.id) return res.status(401).json({ "error": "Unauthorized user" });
    Rx.Observable.fromPromise(mongodb.findOnePromise('article', {}, { "share": { $elemMatch: { "user_id": mongoose.Types.ObjectId(req.body.user_id) } } })).map(function (document) {
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return document;
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully list all")
    })
}

module.exports = {
    createArticle: createArticle,
    listAllArticle: listAllArticle,
    listArticle: listArticle,
    addComment: addComment,
    commentLike: commentLike,
    shareArticle: shareArticle,
    listSharedArticle: listSharedArticle
}

