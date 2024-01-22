const axios = require('axios');
const fs = require('fs');
const unzipper = require('unzipper');
const csv = require('csv-parser');
const connectToDb = require('../db/index.js');
const Stock = require('../models/stock.model.js');


const processCsvFile = async (csvData) => {

    return new Promise((resolve) => {

      const data = [];
  
      const parser = csv();
      
      parser.on('data', (row) => {
        data.push(row);
      });
  
      parser.on('end', () => {
        resolve(data);
      });
  
      parser.on('error', (error) => {
        console.error('CSV Parsing Error:', error.message);
        resolve([]);
      });
  
      parser.write(csvData);
  
      parser.end();

    });
  };
  

const downloadAndProcessCsvFile = async (date) => {
    
    try {
      const zipUrl = `https://www.bseindia.com/download/BhavCopy/Equity/EQ${date}_CSV.ZIP`;
      const response = await axios({ url: zipUrl, responseType: 'arraybuffer' });
  
      const zipFileName = `equity_bhavcopy_${date}.zip`;
      fs.writeFileSync(zipFileName, response.data);
  
      await fs.createReadStream(zipFileName)
        .pipe(unzipper.Extract({ path: 'extracted' }))
        .promise();
  
      const csvFileName = `extracted/EQ${date}.CSV`;
      const data = await processCsvFile(fs.readFileSync(csvFileName, 'utf-8'));

      fs.unlinkSync(zipFileName);
      fs.rmdirSync('extracted', { recursive: true });
      
      return data;
  
    } catch (e) {
      console.log('Error: File not found');
    }
  };
  
const processDataForDatabase = (stocksData, data, dateForDb) => {

    stocksData.forEach(stock => {
        
        const index = data.findIndex(item => item.code === stock.SC_CODE);

        const newStockData = {
            open: stock.OPEN,
            high: stock.HIGH,
            low: stock.LOW,
            close: stock.CLOSE,
            last: stock.LAST,
            date: dateForDb
        }

        if(index != -1) {
        
            data[index].priceHistory.push(newStockData);
        } else {
          
            data.push({
                name: stock.SC_NAME.trim(),
                code: stock.SC_CODE,
                open: stock.OPEN,
                high: stock.HIGH,
                low: stock.LOW,
                close: stock.CLOSE,
                last: stock.LAST,
                date: dateForDb,
                priceHistory: [newStockData]
            });
        }

    });
}

  

const main = async () => {
    
    const today = new Date();
    const data = [];
    let connection;
    
    try {

        let i = 1;
        let weekdaysCount = 1;

        console.log('Downloading and processing data.')

        while (weekdaysCount <= 50) {

            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const dayNumber = date.getDay();

            if(dayNumber !== 0 && dayNumber !== 6) {

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear()).slice(2);
              
                const formattedDate = `${day}${month}${year}`;
                const dateForDb = `${year}-${month}-${day}`;
                 
                const stocksData = await downloadAndProcessCsvFile(formattedDate);
                if(stocksData === undefined) {
                    i++;
                    continue;
                }

                weekdaysCount++;
                processDataForDatabase(stocksData, data, dateForDb);  
                
            }
            
            i++;
        }

        connection = await connectToDb();
        console.log('Inserting Data to database.')
        await Stock.insertMany(data);
        console.log('Data successfully stored in the database.');

    } catch(e) {
        console.log(e);
    } finally {
      
      if(connection) {
        connection.disconnect();
        console.log('Database connection closed.');
      }
      
    }

  };

main();


 



