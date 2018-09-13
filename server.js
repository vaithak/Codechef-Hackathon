const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const profileRoutes = require('./routes/profileRoutes');
const practiseRoutes = require('./routes/practiseRoutes');
const contestRoutes =require('./routes/contestRoutes');
const passportSetup = require('./config/passportSetup');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express()

app.use(express.static('public'))

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie for 30 days
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true }, function() {
    console.log('connected to mongodb');
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/notes', notesRoutes);
app.use('/contests',contestRoutes);
app.use('/practise',practiseRoutes);

app.get('/', function(req, res){
  if(req.user)
  {
      res.redirect('/practise/');
  }
  else
  {
      res.sendFile(__dirname + '/public/html/index.html');
  }
});

app.get('/error.html', function(req, res){
  res.sendFile(__dirname + '/public/html/error.html');
});

const port = process.env.port || 80;

app.listen(port, function(){
  console.log("App listening on port " + port);
})
