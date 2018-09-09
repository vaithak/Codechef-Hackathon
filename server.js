const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const profileRoutes = require('./routes/profileRoutes');
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

app.get('/', function(req, res){
  if(req.user)
  {
      res.redirect('/profile/');
  }
  else
  {
      res.sendFile(__dirname + '/public/html/index.html');
  }
});

app.listen(80, function(){
  console.log('App listening on port 80!')
})
