const express = require('express');
const User = require('../models/User');
const Story = require('../models/Story');
const {
    ensureAuthenticated,
    ensureGuest
} = require('../helpers/auth');
/*******************************************************************/
const router = express.Router();
/*******************************************************************/
////////////////     1
// welcome
router.get('/', ensureGuest, (req, res, next) => {
    res.render("index/welcome");
});
////////////////     2
// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
    Story.find({
            user: req.user.id
        })
        .then(stories => {
            res.render('index/dashboard', {
                stories
            });
        });
});
////////////////     3
// about
router.get('/about', (req, res, next) => {
    res.render("index/about");
});
/*******************************************************************/
module.exports = router;