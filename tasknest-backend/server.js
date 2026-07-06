const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('DB connection error:', err));

// Link Modular Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Start Server
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});