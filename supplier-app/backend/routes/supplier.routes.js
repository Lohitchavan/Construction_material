const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const auth = require('../middleware/auth');

router.post('/products', auth, productCtrl.createProduct);
router.get('/products', auth, productCtrl.getProducts);
router.put('/products/:id', auth, productCtrl.updateProduct);
router.delete('/products/:id', auth, productCtrl.deleteProduct);

module.exports = router;
