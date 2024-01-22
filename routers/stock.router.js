const express = require('express');
const stockController = require('../controllers/stock.controller.js');
const {cacheMiddleware} = require('../middlewares/cache.middleware.js');

const router = express.Router();

router.get('/top', cacheMiddleware, stockController.getTopStocks);

router.get('/search/:stockName', cacheMiddleware, stockController.getStock);

router.get('/history/:id', cacheMiddleware, stockController.getStockPriceHistory);

router.post('/favourites/add/:id', stockController.addStockToFavourites);

router.get('/favourites', cacheMiddleware, stockController.getFavouriteStocks);

router.delete('/favourites/delete/:id', stockController.removeStockFromFavourites);

router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;