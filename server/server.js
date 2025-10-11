require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));

app.get('/', (req, res) => {
    res.send('Welcome to the GreenPlate!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});