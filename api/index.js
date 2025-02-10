const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");


require('dotenv').config();

// // Import Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const searchRouter = require('./routes/searchRoute');

// // App Configurations
const app = express();

app.use(cors({ credentials: true, origin: "https://www.analyzedbyiitians.com" }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// // MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// // Routes Middleware
app.use('/', userRoutes);
app.use('/post', postRoutes);
app.use('/search', searchRouter);
app.use('/send-message', searchRouter);


// // Start the server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
