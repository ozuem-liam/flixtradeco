const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');

// const Insight = require('bitcore-explorers').Insight;


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
    userId: req.user._id,
    username: req.user.username,
    date: req.user.date,
    name: req.user.name,
    wallet: req.user.wallet,
    email: req.user.email
}));
router.get('/a=referals', ensureAuthenticated, (req, res) => res.render('referral'));
router.get('/a=referallinks', ensureAuthenticated, (req, res) => res.render('referrallinks'));

// router.get('/deposit', (req, res) => {
//     User.findById(req.params.id, (err, user) => {
//         res.render('a=deposit=1', {
//             user:user
//         });
//     });
// });

// router.post('/deposit',  (req, res) => {
//     let user = {};
//     user.amount = req.body.amount;

//     let query = {_id:req.params.id};
    
//    User.updateOne(query, user, function(err) {
//             if(err){
//                 console.log(err); 
//                  return; 
//             } else {
//                 res.redirect('/a=deposit=1')
//             }
// });

router.get('/a=deposit=1', ensureAuthenticated, (req, res) => 
res.render('a=deposit=1', {
    amount: req.user.amount
}));
// router.post('/deposit',  (req, res) => {
//     const {depositHistory, username} = req.body;
    
//     User.findOneAndUpdate({ username: username},
//     {
//         $addToSet: {
//             depositHistory: depositHistory,
//         }
//     })
//     // depositHistory.save();
//     res.redirect('/a=deposit=1');
// });


module.exports = router;  