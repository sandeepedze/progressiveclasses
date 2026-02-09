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

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

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

app.get('/', (req, res) => {
    res.send('Edu App - API is running...');
});

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const PORT = process.env.PORT || 5000;

// Helper to kill process on port (Windows specific optimization based on user environment)
const killPort = async (port) => {
    try {
        const platform = process.platform;
        if (platform === 'win32') {
            const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
            if (stdout) {
                const lines = stdout.trim().split('\n');
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1]; // PID is usually last
                    if (pid && !isNaN(pid) && pid !== '0') {
                        try {
                            await execPromise(`taskkill /PID ${pid} /F`);
                            console.log(`Killed process ${pid} on port ${port}`);
                        } catch (e) {
                            // Ignore if already dead
                        }
                    }
                }
                // Wait small buffer for OS release
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } else {
            // Linux/Mac fallback just in case
            try {
                await execPromise(`lsof -i :${port} -t | xargs kill -9`);
            } catch (e) { }
        }
    } catch (err) {
        // No process found or permission error, proceed
    }
};

const startServer = async () => {
    try {
        // 1. Cleanup Port
        await killPort(PORT);

        // 2. Database Connection
        await connectDB();

        // 3. Sync Database
        // Since you manually imported the SQL file, we disable 'alter: true' 
        // to avoid conflicts with existing foreign key constraints.
        await sequelize.sync();
        console.log('Database synced');

        // 4. Start Server
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`ERROR: Port ${PORT} is still in use after cleanup. Exiting.`);
                process.exit(1);
            } else {
                console.error(err);
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Prevent duplicate initialization
if (require.main === module) {
    startServer();
}
