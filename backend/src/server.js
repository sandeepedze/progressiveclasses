const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Make io accessible to routes
app.set('socketio', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/institutes', require('./routes/instituteRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

app.get('/', (req, res) => {
    res.send('Edu App - API is running...');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    // Sync Database
    // Since you manually imported the SQL file, we disable 'alter: true' 
    // to avoid conflicts with existing foreign key constraints.
    await sequelize.sync();
    console.log('Database synced');

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
