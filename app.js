const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');

const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const app = express(); 

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


// EJS Engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session 
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
        cookie: { secure: true,
                maxAge:  6*60*60*1000 },
        store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Static Files
app.use(express.static('views'));
app.use('/users', express.static('views'));
app.use(express.static('views/user'));
// app.use('/users', express.static('views/images'))
// app.use('/users', express.static('views/js'))


app.listen(process.env.PORT || 9999, () => {
    console.log(`Server up at 9999`)
})

