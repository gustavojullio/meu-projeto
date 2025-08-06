var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
// var mongoose = require('mongoose');

var app = express();

// const dbConnectionString = process.env.MONGO_URL || 
//   (process.env.NODE_ENV === 'test' 
//     ? 'mongodb://localhost:27017/agricola_teste'      // 2. Fallback para testes locais
//     : 'mongodb://localhost:27017/agricola');      // 3. Fallback para desenvolvimento local

// // Conecta ao banco de dados usando a string definida
// mongoose.connect(dbConnectionString).then(() => {
//   console.log(`Servidor conectado ao MongoDB com sucesso!`);
// }).catch((err) => {
//   console.error('Erro ao conectar ao MongoDB:', err);
//   process.exit(1); // Encerra a aplicação se não conseguir conectar
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'seu-segredo-super-secreto-aqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;