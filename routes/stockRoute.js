const express = require('express');
const {addStock, deleteStock, viewStock, viewChart} = require('../controller/stockcontroller/stockController');
const {jwtAuthMiddleware} = require('../middleware/auth')

const router = express.Router();

router.post('/add-stock', jwtAuthMiddleware, addStock)

router.get('/view/:symbol', jwtAuthMiddleware, viewStock)

router.delete('/delete/:symbol', jwtAuthMiddleware, deleteStock)

router.get('/view/:symbol/chart', jwtAuthMiddleware, viewChart)

module.exports = router