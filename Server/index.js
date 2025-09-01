require('dotenv').config();
const express = require('express');
const cors = require('cors');

const contactRoutes = require('./routes/contactRoutes');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const { startOrderCleanup } = require('./utils/cronJobs');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());


// Serve uploads folder statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB(); // Connect to DB

app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
startOrderCleanup();

// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(errorHandler);

// Add env file in folder (server/.env) with the following variables:
// EMAIL_USER=
// EMAIL_PASS=
// MONGO_URI=
// JWT_SECRET=
