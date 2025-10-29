require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // Create HTTP server from Express app
connectDB();

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Make sure this matches your client port
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection test
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- Middleware ---

// Make 'io' accessible to all routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Enable CORS for all Express routes
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.get('/', (req, res) => res.send('Welcome to the GreenPlate API!'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
// --- Start Server ---
// Start the 'server' (with Socket.IO) NOT the 'app'
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});