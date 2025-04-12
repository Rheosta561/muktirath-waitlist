const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
require('./models/dbconnect');
const authRouter = require('./routes/authrouter')
const cors = require('cors');
const recommend = require('./routes/recommend');
const restaurantRouter = require('./routes/restaurantRouter');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send("hello working");
})
app.use('/auth', authRouter);
app.use('/recommendation',recommend);
app.use('/restaurant', restaurantRouter);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})