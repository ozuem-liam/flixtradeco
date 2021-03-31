const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));


// Register Handle
router.post('/register', (req, res) => {
    console.log('it worked');
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

        let errors = [];

        // Check required fields
        if(!name || !username || !email || !emailcheck || !password || !passwordcheck || !secretquestion || !secretanswer || !wallet) {
              errors.push({ msg: 'Please fill in all fields'});
            }

        // Check passwords match
        if(email !== emailcheck) {
              errors.push({ msg: 'Emails do not match' });
        }

        // Check passwords match
        if(password !== passwordcheck) {
              errors.push({ msg: 'Passwords do not match' });
        }

        // Check password lenght
        if(password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters' });
        }

        if(errors.length > 0) {
            res.render('register', {
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
            })
        } else {
            // Validation passed
            User.findOne({ email: email })
              .then(user => {
                  if(user) {
                      // User exist
                      errors.push({ msg: 'Email is already registered' })
                      res.render('register', {
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
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }) )  
                  }
              });
        }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/account',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout 
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;



