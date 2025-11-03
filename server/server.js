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
    socket.on('join_room', (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined room ${userId}`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- Middleware ---

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cors());

// --- ⭐️ CORRECTED API ROUTE & PARSER ORDER ⭐️ ---

// 1. Define API root route
app.get('/', (req, res) => res.send('Welcome to the GreenPlate API!'));

// 2. Define routes that handle 'multipart/form-data' (file uploads).
// These MUST come BEFORE the express.json() parser.
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));

// 3. Now, define the body parsers.
// These will apply to all routes defined *after* this point.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 4. Define all other routes that *do* use JSON/URL-encoded bodies.
app.use('/api/users', require('./routes/userRoutes'));
//app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes.js'));
app.use('/api/claims', require('./routes/claimRoutes'));
// --- End of Fix ---

// --- Start Server ---
// (The old app.use(...) lines have been removed from here)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});