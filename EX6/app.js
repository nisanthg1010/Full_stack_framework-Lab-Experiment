// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

// Create express app
const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');

// Set public folder for static files like CSS
app.use(express.static('public'));

// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Failed:", err));

// Load authentication routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
