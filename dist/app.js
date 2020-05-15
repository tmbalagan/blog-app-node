"use strict";

var _http = _interopRequireDefault(require("http"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _auth = _interopRequireDefault(require("./routes/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// var authRoutes = require('./routes/auth')
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));

_mongoose["default"].connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log('MongoDB connected');
})["catch"](function (err) {
  console.log('MongoDB err ', err);
}); // app.use('/api/blog', authRoutes)
// catch 404 and forward to error handler


app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

_http["default"].createServer(app, function () {
  console.log('Server running at http://127.0.0.1:1337/');
}).listen(1337);