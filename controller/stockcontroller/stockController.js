const axios = require('axios');
require('dotenv').config();
const Stock = require('../../models/stock')

// Stock API key (replace with your actual key from Alpha Vantage)
const API_KEY = process.env.STOCK_API_KEY; 

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
    // Extract stock symbol from the database or request
    const stock = req.params.symbol; // Assuming you're getting the symbol from the request params
    const interval = req.query.interval || '1min'
    const apiUrl = `https://api.twelvedata.com/time_series?symbol=${stock}&interval=${interval}&apikey=${API_KEY}`;
    
    // Fetch stock data from the API
    const response = await axios.get(costant);
    console.log(response.data)

    //Check if the response is valid and contains stock data
    if (response.data) {
      const stockData = response.data.values;
      const stockMeta = response.data.meta; // Get the stock metadata

    // Render the EJS template with the stock data
      return res.render('stockdetail', { stockData, stockMeta, interval});
    } else {
      // If no data is found, render the template with empty data
      return res.render('stockdetail', { stockData: [], stockMeta: {}, interval});
    }
  } catch (err) {
    console.error(err);
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

