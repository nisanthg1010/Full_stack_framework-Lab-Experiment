const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Set view engine and middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use('/', blogRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`🚀 Server running at ${url}`);

  // Dynamically import 'open' to avoid CommonJS conflict
  import('open').then(open => {
    open.default(url); // Automatically opens the browser
  }).catch(err => {
    console.error('❌ Failed to open browser:', err);
  });
});
