import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import adminRoutes from './routes/admin.routes';
import prisma from './prisma/client';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-frontend-url.com'
    : ['http://localhost:5500']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/admin', adminRoutes);

const PORT = 8000;

// Test database connection before starting the server
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
export {};
