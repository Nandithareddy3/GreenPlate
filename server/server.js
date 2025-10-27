require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
connectDB();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
});
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/', (req, res) => res.send('Welcome to the GreenPlate API!'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.get('/', (req, res) => {
    res.send('Welcome to the GreenPlate!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});