const Stock = require('../models/stock.model.js');
const Favourite = require('../models/favourite.model.js');
const {setCacheValue} = require('../middlewares/cache.middleware.js');

const getTopStocks = async(req, res) => {
    
    const limit = parseInt(req.query.limit) || 10;

    try {

        const stocks = await Stock.find({});
        
        stocks.sort((a, b) => {

            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        const mostRecentDate = stocks.length > 0 ? stocks[0].date : null;

        if(!mostRecentDate) {
            return res.status(404).json({error: 'No stocks found in the database.'})
        }

        const stocksForMostRecentDate = stocks.filter(stock => stock.date === mostRecentDate);

        const stocksWithPercentageChange = stocksForMostRecentDate.map(stock => {

            const open = stock.open;
            const close = stock.close;
      
            const percentageChange = ((close - open) / open) * 100;
      
            return {
              id: stock._id,
              name: stock.name,
              code: stock.code,
              date: stock.date,
              open: stock.open,
              close: stock.close,
              gainPercentage: percentageChange,
            };

          });

          const topStocks = stocksWithPercentageChange.sort((a, b) => b.gainPercentage - a.gainPercentage).slice(0, limit);
          
          const key = req.originalUrl || req.url;
          setCacheValue(key, topStocks);

          res.status(200).json({data: topStocks});

    } catch (e) {
        res.status(500).json({error: 'Internal server error.'});
    }
}

const getStock = async(req, res) => {
    
    const stockName = req.params.stockName;

    if(!stockName) {
        return res.status(400).json({error: 'Missing name parameter.'})
    }

    try {
        
        const stocks = await Stock.find({name: {$regex: stockName, $options: 'i'}}, '-priceHistory');

        if(stocks.length === 0) {
            return res.status(404).json({message: 'No stock with this name exists.'}); 
        }

        const key = req.originalUrl || req.url;
        setCacheValue(key, stocks);

        res.status(200).json({data: stocks});
        
    } catch (e) {
        res.status(500).json({error: 'Internal server error.'})
    }
}

const getStockPriceHistory = async(req, res) => {
    
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({error: 'Missing id parameter.'});
    }

    try {
        
        const stock = await Stock.findById(id, 'name code priceHistory');
        
        if(!stock) {
            return res.status(404).json({error: "Stock with this id doesn't exists."});
        }

        const key = req.originalUrl || req.url;
        setCacheValue(key, stock);

        res.status(200).json({data: stock});

    } catch (e) {
        
        res.status(500).json({error: 'Internal server error.'});
    }
}

const addStockToFavourites = async(req, res) => {
    
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({error: 'Missing id parameter.'});
    }

    try {

        const stock = await Stock.findById(id);
        if(!stock) {
            return res.status(404).json({error: "Stock with this id doesn't exists."}); 
        }

        const existingInFavourites = await Favourite.find({stock: stock._id});

        if(existingInFavourites.length > 0) {
            return res.status(200).json({message: 'You have already added this stock to favourites.'})
        }

        const newFavorite = new Favourite({
            stock: stock._id    
        });
        
        await newFavorite.save();

        res.status(200).json({message: 'Stock added to favourites successfully.'})
        
    } catch (e) {
        res.status(500).json({error: 'Internal server error.'})
    }
}

const getFavouriteStocks = async(req, res) => {
    
    try {
        const favouriteStocks = await Favourite.find().populate('stock', '-priceHistory');

        const key = req.originalUrl || req.url;
        setCacheValue(key, favouriteStocks);

        res.status(200).json({data: favouriteStocks});
    } catch (e) {
        res.status(500).json({error: 'Internal server error.'})
    }
}

const removeStockFromFavourites = async(req, res) => {
    
    const id = req.params.id;
    if(!id) {
        return res.status(400).json({error: 'Missing id parameter.'});
    }

    try {
        
        const stock = await Favourite.findOneAndDelete({stock: id});
        if(!stock) {
            return res.status(404).json({error: "Stock with this id doesn't exists in favourites."})
        }
        res.status(200).json({message: `Stock removed successfully from favourites`});

    } catch (e) {
        res.status(500).json({error: 'Interval server error.'});
    }
}

module.exports = {
    getTopStocks,
    getStock,
    getStockPriceHistory,
    addStockToFavourites,
    getFavouriteStocks,
    removeStockFromFavourites
}