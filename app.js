var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function(req, res, next) {

   // Guardar path en session.redir para después de Login
   if (!req.path.match(/\/login|\/logout/)) {
      req.session.redir = req.path;
   }

   // Hacer visuble req.session en las vistas
   res.locals.session = req.session;
   next();
});

// Desconexión automática - Auto-logout
app.use(function(req, res, next) {

  // Si hay Sesión iniciada, realizar la comprobación
   if (req.session.user) {
      var hora = new Date().getTime();

      // Si no existe información previa, obtener hora actual
      // Esto se da en el primer inicio
      if (!req.session.lastTime) {
         req.session.lastTime = hora;
         next();
      } else {
         var miliseg;   // Almacena la diferencia en milisegundos

         // Obtener la diferencia de tiempo actual en milisegundos
         miliseg = hora - req.session.lastTime;

         // Actualizar la hora actual para la siguiente comprobación
         req.session.lastTime = hora;

         // Las diferencias se calculan el milisegundos
         if (miliseg < 20000) {
            next();
         } else {
            delete req.session.lastTime;
            delete req.session.user;
            res.redirect('/login');
         }
      }
   } else {
      next();
   }
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

//console.log("valor de env: " + app.get('env'));
module.exports = app;
