# Stock Price Application

An application to access and manage data from the Bombay Stock Exchange (BSE).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Dependencies Used](#dependencies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)

## Features

- Retrieve the top 10 stocks.
- Find stocks by name.
- Get stock price history for UI graph.
- Add a stock to favorites.
- See favorite stocks.
- Remove a stock from favorites.
- Used cache to reduce the load on database (time to live is set to 10 secs).

## Tech Stack

- **Node.js:** A JavaScript runtime for server-side development, handling the backend logic.
   - Version: 14.17.5

- **Express.js:** A web application framework for Node.js, simplifying the process of building robust APIs.

- **MongoDB:** A NoSQL database for storing blog post data.

- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js, simplifying interactions with the database.

## Dependencies Used:

- **axios:** Promise-based HTTP client for making requests to external APIs.
  - Version: ^1.6.5

- **csv-parser:** Library for parsing CSV data, used for reading data from the Equity Bhavcopy CSV.
  - Version: ^3.0.0

- **dotenv:** Zero-dependency module that loads environment variables from a .env file.
  - Version: ^16.3.1

- **express:** Web application framework for Node.js, used to build the RESTful API.
  - Version: ^4.18.2

- **mongoose:** MongoDB object modeling tool designed to work in an asynchronous environment, used for database interactions.
  - Version: ^7.4.5

- **nodemon:** Development tool that automatically restarts the server on file changes.
  - Version: ^3.0.3

- **unzipper:** Utility for reading from and extracting ZIP archives.
  - Version: ^0.10.14

- **node-cache:** A simple caching module that has set, get and delete methods and works a little bit like memcached.
  - Version: ^5.1.2

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ujjwal-7/stock-price-app.git
   
2. Navigate to the project directory:
   
   ```bash
   cd stock-price-app
   
3. Install dependencies:
    - Install the dependencies mentioned above using npm install command.
      
   ```bash
   npm install

5. Configure .env file:

    - Create a new file named .env in the root of your project.
    - Configure PORT, MONGODB_CONNECTION_STRING, DATABASE_NAME in .env file


6. Start the server:
   ```bash
   npm start

## Usage

When you run npm start, a script will be executed to download data, process it, and store the results in the database. You may encounter errors in the console indicating that a file is not found. This issue arises when the required file is missing because it was not uploaded to the BSE website. You can safely ignore these errors as the files are not present due to a holiday at BSE.

  <div align="center">
        <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/6e8873da-1fdc-4dff-9acb-d6ceec8cb276" alt="terminal" height="400">
  </div>

### API Endpoints![top-stocks]

1. To find top 10 stocks use this endpoint http://localhost:8000/api/stocks/top?limit=10  (GET). If you don't give the limit query then by default limit will be set to 10.

<div align="center">
  <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/c16cbf67-ac05-42c0-b250-e0e85fbca4b7" alt="top-10-high" height="400">
</div>

2. To find stocks by name use this endpoint http://localhost:8000/api/stocks/search/:stockName (GET)
   
<div align="center">

  <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/e15c8ba9-d0b4-4577-9c4c-718d16a22660" alt="search-by-name" height="400">
</div>

3. To retrieve stock price history use this endpoint http://localhost:8000/api/stocks/history/:id  (GET)

<div align="center">
  <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/e44340c5-1ba0-44f2-9a0c-49a9beafd1b8" alt="price-history" height="400">
</div>

4. To add a stock to favourites use this endpoint http://localhost:8000/api/stocks/favourites/add/:id (POST)

<div align="center">
  <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/3c3992f0-8b3b-4653-ac75-fc9615226701" alt="add-to-favourites" height="400">
</div>

5. To see favourite stocks use this endpoint http://localhost:8000/api/stocks/favourites (GET)

<div align="center">
  <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/6a3085df-ee3a-453e-addf-f9baeb16df88" alt="favourites" height="400">
</div>

6. To remove a stock from favourites use this endpoint http://localhost:8000/api/stocks/favourites/delete/:id (DELETE)

<div align="center">
  <img src="https://github.com/ujjwal-7/stock-price-app/assets/91021747/541943b4-d7ab-4abc-bed3-89761c727281" alt="top-10-high" height="400">
</div>
