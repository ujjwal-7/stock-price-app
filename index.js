const express = require('express');
require('dotenv').config();
const connectToDb = require('./db/index.js');
const stockRouter = require('./routers/stock.router.js');

const app = express();
const PORT = process.env.PORT;

connectToDb();

app.use('/api/stocks', stockRouter);

app.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});