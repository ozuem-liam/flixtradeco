const express = require('express');
const path = require('path');

// const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const app = express();

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session 
app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: true
}));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// app.use('/', express.static(path.join(__dirname, 'flixtrade.co')))
app.use(express.static('./flixtrade.co'))



// app.get('/', (req,res) => {
//     res.send("Welcome")
// })

app.post('/user_create', async (req, res) => {
    // console.log("POST Request Called")
    const {
        name, 
        username, 
        email, 
        emailcheck, 
        password, 
        passwordcheck, 
        secretquestion, 
        secretanswer, 
        wallet 
       } = req.body;
    // res.end()

      // Validation passed
      User.findOne({ email: email })
      .then(user => {
          if(user) {
              // User exist
              errors.push({ msg: 'Email is already registered' })
              res.render('user_create', {
                errors,
                name, 
                username, 
                email, 
                emailcheck, 
                password, 
                passwordcheck, 
                secretquestion, 
                secretanswer, 
                wallet                 
            });                        
          } else {
                const newUser = new User({
                    name, 
                    username, 
                    email, 
                    password,
                    secretquestion, 
                    secretanswer, 
                    wallet       
                });

            // Hash Password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered and can login');
                        res.redirect('/login.html');
                    })
                    .catch(err => console.log(err));
            }) )  
          }
      });
})

// Login Handle
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard.html',
        failureRedirect: '/login.html',
        failureFlash: true
    })(req, res, next);
});

// Logout 
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
    console.log(`Server up at ${PORT}`)
})