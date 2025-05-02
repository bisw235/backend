import express from 'express';
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './db/db.js';

dotenv.config();
const app = express();

// ✅ Allowed frontend origins (web or React Native using IP)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'http://192.168.1.22',
  'http://192.168.1.22:19006',
];

// ✅ CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ✅ Body parsers with increased limit to fix PayloadTooLargeError
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: 30 * 1000, // 30 seconds
  }
}));

// ✅ Routes
app.use('/api/user', userRoutes);

// ✅ Ping route to test session extension
app.get('/api/session/ping', (req, res) => {
  if (!req.session.startTime) {
    req.session.startTime = Date.now();
  }

  const elapsed = Date.now() - req.session.startTime;

  if (elapsed > 60 * 60 * 1000) {
    req.session.destroy(() => {
      res.status(440).json({ message: 'Session expired after 1 hour' });
    });
  } else {
    res.status(200).json({ message: 'Session extended', remainingTime: 60 * 60 * 1000 - elapsed });
  }
});

// ✅ Basic test route to verify connection
app.get('/api/test', (req, res) => {
  res.send('Backend is reachable');
});

// ✅ Sync database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced (with alter)');
}).catch(console.error);


// ✅ Start server on all interfaces (for network access)
const port = process.env.PORT || 5001;
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
