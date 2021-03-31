const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Home routes
router.get('/', (req, res) => res.render('welcome'));
router.get('/about', (req, res) => res.render('about'));
router.get('/contactus', (req, res) => res.render('contactus'));
router.get('/faq', (req, res) => res.render('faq'));
router.get('/forgotpass', (req, res) => res.render('forgotpass'));
router.get('/news', (req, res) => res.render('news'));
router.get('/rules', (req, res) => res.render('rules'));
// router.use(express.static('./flixtrade.co'))


// Dashboard
router.get('/account', ensureAuthenticated, (req, res) => 
res.render('a=account', {
    username: req.user.username
}));

module.exports = router;  