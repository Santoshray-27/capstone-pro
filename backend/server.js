/**
 * Smart AI Resume Analyzer - Main Server Entry Point
 * Production-ready Express.js backend with MongoDB
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import route handlers
const authRoutes = require('./routes/auth.routes');
const resumeRoutes = require('./routes/resume.routes');
const analysisRoutes = require('./routes/analysis.routes');
const jobRoutes = require('./routes/job.routes');
const interviewRoutes = require('./routes/interview.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
<<<<<<< HEAD
const screeningRoutes = require('./routes/screening.routes');
=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ========================
// Security Middleware
// ========================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ========================
// CORS Configuration
// ========================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========================
// Request Parsing
// ========================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ========================
// Logging (dev only)
// ========================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ========================
// Static File Serving
// ========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// Health Check
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart AI Resume Analyzer API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ========================
// API Routes
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recruiter', recruiterRoutes);
<<<<<<< HEAD
app.use('/api/screening', screeningRoutes);
=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2

// ========================
// Serve React Frontend (in production / sandbox)
// ========================
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (require('fs').existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ========================
// 404 & Error Handlers
// ========================
app.use(notFound);
app.use(errorHandler);

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Smart AI Resume Analyzer Backend     ║
╠════════════════════════════════════════╣
║  Status:   ✅ Running                  ║
║  Port:     ${PORT}                        ║
║  Mode:     ${process.env.NODE_ENV || 'development'}                 ║
║  API:      http://localhost:${PORT}/api   ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err.name, err.message);
  process.exit(1);
});

module.exports = app;
