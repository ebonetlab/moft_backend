const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
});

var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan'),
path = require('path'),
http = require('http');

//app.all('*', [require('./middleware/validateRequest')]);

var indexRouter = require('./routes/index');
var   usersRouter = require('./routes/users');

var app = express();

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
/*let allowedOrigins = ['https://moft.eabonet.com'];
var corsOptions = {
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

var server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
});

