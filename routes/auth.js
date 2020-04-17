const express = require('express');
const passport = require('passport');
/*******************************************************************/
const router = express.Router();
/*******************************************************************/
////////////////     1
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

////////////////     2
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
////////////////     3
router.get("/verify", (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log("Not Auth");
    }
})
////////////////     4
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
})
/*******************************************************************/
module.exports = router;