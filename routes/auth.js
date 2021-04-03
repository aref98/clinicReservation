
const express = require('express');

const {check,body} = require('express-validator');

const authController = require('../controllers/auth');
// const User=require('../models/user')
const router = express.Router();
 
// router.get('/login',authController.getLogin);

router.post('/login',[check('email'),check('password').trim()],authController.login);

// router.post('/logout',authController.postLogout);

// router.get('/signup',authController.getSignup);

router.post('/signup',authController.postSignup);

// router.get('/reset',authController.getReset);

// router.post('/reset',authController.postReset);

// router.get('/reset/:token',authController.getNewPassword);

// router.post('/new-password',authController.postNewPassword);



module.exports = router;
