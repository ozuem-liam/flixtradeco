const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const adminRouter = require('./routes/admin.router')

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
app.use('/admin', adminRouter);

// Static Files
app.use(express.static('views'));
app.use('/users', express.static('views'));

// rollup config
const sayHello = require('./modules/MyModule');

sayHello('Hello from Rollup');
const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
    console.log(`Server up at ${PORT}`)
})

// Checkbox value page rendar
