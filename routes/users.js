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
    // console.log('it worked');
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
    if (!name || !username || !email || !emailcheck || !password || !passwordcheck || !secretquestion || !secretanswer || !wallet) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (email !== emailcheck) {
        errors.push({ msg: 'Emails do not match' });
    }

    // Check passwords match
    if (password !== passwordcheck) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password lenght
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
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
                if (user) {
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
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
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

// Update Handle
// router.post('/login', (req, res, next) => {
//     User.updateOne
//     })
// });

// Logout 
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});



// Load User edit form
router.get('/a=edit_account/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        res.render('a=edit_account', {
            user: user
        });
    });
});

// Update submit POST Route
router.post('/a=edit_account/:id', (req, res) => {
    let user = {};
    user.name = req.body.name;
    user.password = req.body.password;
    user.wallet = req.body.wallet;
    user.email = req.body.email;

    let query = { _id: req.params.id }
    // Hash Password
    bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            user.password = hash;
            // update user
            User.updateOne(query, user, function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect('/account')
                }

            });
        }));
});


router.get('/deposit', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        res.render('a=deposit=1', {
            user: user
        });
    });
});

router.post('/deposit', async (req, res) => {
    let user = {};


    // let query = { _id: req.user._id };
    try {
        const newUser = await User.findByIdAndUpdate(req.user.id, user)
        user.amount = req.body.amount;
        res.redirect('/a=deposit=1')
    } catch (err) {
        res.redirect('back')
    }

    // User.updateOne(query, user, function (err) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         res.redirect('/a=deposit=1')
    //     }
    // })
});

// getById(id) {
//     return TransactionDoc.findOneById(id).exec().then(t => cleanTransaction(t));
//   }
module.exports = router;



