const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { createArticle, listAllArticle, listArticle, addComment, commentLike, shareArticle, listSharedArticle } = require('../routes/article')
var app = express.Router();

module.exports = app;

// app.get('/list-all-article', listAllArticle)


app.use((req, res, next) => {
    var token = req.headers['x-access-token'] || req.headers["authorization"];
    if (!token) return res.status(403).json({ auth: false, message: 'No token provided.' });
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
});

app.post('/create-article', createArticle)
app.get('/list-article', listArticle)
app.post('/artilce-wise-add-comment', addComment)
app.post('/comment-wise-like', commentLike)
app.post('/share-article', shareArticle)
app.get('/list-share-article', listSharedArticle)





