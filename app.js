const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
});

let createError = require('http-errors');
let express = require('express');
let session = require('cookie-session');
require('dotenv').config();
let cors = require('cors');
const passport = require('passport');
let path = require('path');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let logger = require('morgan'),
http = require('http');

//app.all('*', [require('./middleware/validateRequest')]);

let indexRouter = require('./routes/index');
let   usersRouter = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 5000);

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
/*let allowedOrigins = ['https://moft.eabonet.com'];
let corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    },
     methods: ["POST, GET"],
    maxAge: 3600,
    
  }
}*/



app.all('/*',cors(), function (req, res, next) {
  console.log('Arrived')
  res.header("Access-Control-Allow-Origin", "https://moft.eabonet.com");
  //res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type, Accept, x-token, X-Key,Origin, X-Requested-With");
  res.header( 'Access-Control-Allow-Credentials', true);
  if (req.method == 'OPTIONS') {
      res.status(200).end();
  } else {
      next();
  }
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 if(!req && !res){
  next(createError(404));
 }
});

app.use(session({
  secret: 'Login Session',
  resave: true,
  saveUninitialized: false
}));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
});

