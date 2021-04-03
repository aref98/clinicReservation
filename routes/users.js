const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth');

const clinicController = require('../controllers/users');

const router = express.Router();
// const isAuth = require('../middleware/is-auth');


router.get('/list', clinicController.getIndex);

// router.get('/products', shopController.getProducts);

// router.get('/ShowProducts', shopController.getProducts);

router.get('/pages/:doctor', clinicController.getDoctor);

router.get('/pages/:doctor/appointment/:appointment',isAuth, clinicController.getAppointment);

// router.get('/cart',isAuth, shopController.getCart);

// router.get('/orders/:orderId',isAuth, shopController.getInvoices);

module.exports = router;
