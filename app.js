const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(() => {
  console.log('MongoDB connected')
}).catch((err) => {
  console.log('MongoDB err ', err);
});

app.use('/api', authRoutes)
app.use('/api/blog', routes)


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

http.createServer(app, () => {
  console.log('Server running at http://127.0.0.1:1337/');
}).listen(1337);
