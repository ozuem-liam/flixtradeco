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


// User Routing
router.get('/account', ensureAuthenticated, (req, res) => 
res.render('a=account', {
    username: req.user.username,
    date: req.user.date
}));

router.get('/a=home', ensureAuthenticated, (req, res) => res.render('a=home'));

router.get('/a=about-us', ensureAuthenticated, (req, res) => res.render('a=about'));

router.get('/a=faq', ensureAuthenticated, (req, res) => res.render('a=faq'));

router.get('/a=news', ensureAuthenticated, (req, res) => res.render('a=news'));

router.get('/a=contactus', ensureAuthenticated, (req, res) => res.render('a=contactus'));

router.get('/a=rules', ensureAuthenticated, (req, res) => res.render('a=rules'));

// User Account Routing

router.get('/a=deposit', ensureAuthenticated, (req, res) => res.render('deposit'));
router.get('/a=deposit_list', ensureAuthenticated, (req, res) => res.render('deposit_list'));
router.get('/a=withdraw', ensureAuthenticated, (req, res) => res.render('withdraw'));
router.get('/a=withdraw_history', ensureAuthenticated, (req, res) => res.render('withdraw_history'));
router.get('/a=earnings', ensureAuthenticated, (req, res) => res.render('history'));
router.get('/a=security', ensureAuthenticated, (req, res) => res.render('setting'));
router.get('/a=edit_account', ensureAuthenticated, (req, res) => 
res.render('edit_account', {
    username: req.user.username,
    date: req.user.date,
    fullname: req.user.fullname,
    wallet: req.user.wallet,
    email: req.user.email
}));
router.get('/a=referals', ensureAuthenticated, (req, res) => res.render('referral'));
router.get('/a=referallinks', ensureAuthenticated, (req, res) => res.render('referrallinks'));

module.exports = router;  