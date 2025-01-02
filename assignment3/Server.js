const express = require('express');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const logger = require('./logger/log');

//check env file: port value
const dotenv = require('dotenv').config();
const app = express();
// connectDB();
connectDB().then(() => {
    logger.info('Database connected successfully');
}).catch(err => {
    logger.error(`Database connection failed: ${err.message}`);
});


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
    '/api',require('./routes/router')
)
app.listen(port, () => 
`Server is running on the port ${port}!
-------------------------------------------------------------------------`)