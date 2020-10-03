var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser')
var logger = require('morgan');
const mongoose = require('mongoose')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const User = require('./models/user');

var indexRouter = require('./routes/index');
var adminsRouter = require('./routes/admin');
var conducteurRouter = require('./routes/conducteur')
var commerceRouter = require('./routes/commerce')

require('dotenv').config(); // ENV VARIABLE

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@lfc-dufxi.mongodb.net/${process.env.MONGO_DB_DBNAME}`

var app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'fearl, zd,alekr,faelr,fm',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/', indexRouter);
app.use('/admin', adminsRouter);
app.use('/conducteur',conducteurRouter)
app.use('/commercant',commerceRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(process.env.MONGO_DB_USER)
mongoose.connect(MONGODB_URI,{useNewUrlParser: true ,useUnifiedTopology: true })
        .then(r => {
          console.log('connected with mongoose')
        }).catch(err => {
          console.log(err)
        })

module.exports = app;
