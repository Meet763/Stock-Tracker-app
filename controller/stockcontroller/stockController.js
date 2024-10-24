const axios = require('axios');
require('dotenv').config();
const Stock = require('../../models/stock')


// Route to fetch stock data
const addStock = async (req, res) => {
  try {
      const { stockTicker } = req.body; // Get the stock symbol from the body
      const upperCaseStockTicker = stockTicker.toUpperCase();

      // Check if the stock symbol already exists for the user
      const existingStock = await Stock.findOne({ stock: upperCaseStockTicker, userid: req.user.id });

      if (existingStock) {
          // If the stock already exists, return an error message
          return res.render('dashboard', {
              symbols: await Stock.find({ userid: req.user.id }), // Fetch current symbols
              error: 'This stock symbol is already added to your watchlist.' // Pass error message
          });
      }

      // Save the stock symbol to the database
      const data = {
          stock: upperCaseStockTicker,
          userid: req.user.id
      };

      const stock = new Stock(data);
      await stock.save();

      // Fetch the updated list of symbols
      const symbols = await Stock.find({ userid: req.user.id });

      return res.render('dashboard', { symbols: symbols }); // Render dashboard with symbols

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
}


const viewStock = async (req, res) => {
  try {
    const API_KEY = process.env.STOCK_API_KEY;  // Use the environment variable for the API key
    const stock = req.params.symbol;   // Default to 'IBM' if no symbol is provided
    const interval = req.query.interval || '1min';  // Default interval is '1min'

    // Construct the API URL using the provided stock symbol and interval
    const apiUrl = `https://api.twelvedata.com/time_series?symbol=${stock}&interval=${interval}&apikey=${API_KEY}&source=docs`;
    
    // Fetch stock data from the API
    const response = await axios.get(apiUrl);

    // Check if the response contains meta and values data
    if (response.data && response.data.meta && response.data.values) {
      const stockData = response.data.values;  // Extract stock data values
      const stockMeta = response.data.meta;    // Extract stock metadata

      // Send the stock metadata and data as JSON
      //return res.status(200).json({ stockMeta, stockData });
      return res.status(200).render('stockdetail', {stockMeta, stockData, interval})
    } else {
      // Handle cases where stock data is missing or invalid
      return res.status(404).json({ error: 'Stock data not found or invalid response' });
    }

  } catch (err) {
    console.error('Error fetching stock data:', err.message);
    
    // Handle errors, such as API failures or server issues
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteStock = async (req, res) => {
  try {
    const stocksymbol = req.params.symbol; // Get the stock symbol from the URL

    await Stock.deleteOne({stock: stocksymbol})

    const symbols = await Stock.find({ userid: req.user.id });

    return res.render('dashboard', { symbols: symbols });

    // res.json("message deleted")

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const viewChart = async (req, res) => {
  try {
    const stock = req.params.symbol; // Get the stock symbol from the URL
    const interval = req.query.interval || '1min';
    const apiUrl = `https://api.twelvedata.com/time_series?symbol=${stock}&interval=${interval}&apikey=${API_KEY}`;

    const response = await axios.get(apiUrl);

    const chartData = response.data.values

    res.render('chart', { stockMeta: { symbol }, chartData, interval });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {addStock, deleteStock, viewStock, viewChart};

