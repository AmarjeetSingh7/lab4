'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
router.get('/', function (req, res) {
    res.render('index');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/user',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});
router.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (req.body.password && req.body.username) {

                if (!user.length) {
                    const newUser = new userModel(registerUser);
                    newUser.save(function (err) {
                        if (err) console.log(err);
                        console.log('registerUser: ' + registerUser.username + " " + registerUser.password)
                        res.redirect('/login');
                    });
                } else {
                    console.log('Username is already exist, please try again.');
                    res.redirect('/register');
                }

            } else if (!req.body.password && !req.body.username) {
                console.log('There is not username and password, please try again.');
                res.redirect('/register');
            } else if (!req.body.password) {
                console.log('There is not password, please try again.');
                res.redirect('/register');
            } else if (!req.body.username) {
                console.log('There is not username, please try again.');
                res.redirect('/register');
            }
        });
    });
});
router.get('/register', function (req, res) {
    res.render('register');
});
router.get('/login', function (req, res) {
    res.render('login');
});

module.exports = router;
