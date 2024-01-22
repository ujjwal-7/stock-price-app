const NodeCache = require("node-cache");
const myCache = new NodeCache();

const cacheMiddleware = (req, res, next) => {

    const key = req.originalUrl || req.url;
    const cachedData = myCache.get(key);

    if(cachedData) {
        return res.status(200).json({data: JSON.parse(cachedData)});
    }
    next();
}

const setCacheValue = (key, value) => {
    
    myCache.set(key, JSON.stringify(value), 10);
}

module.exports = {
    cacheMiddleware, 
    setCacheValue
};