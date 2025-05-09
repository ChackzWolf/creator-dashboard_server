import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import socialRoutes from './routes/socialAuth.js'



const app: Application = express();

const allowedOrigins = [
  'https://creator-dashboard-client.web.app',
];

const corsOptions = {
  origin: (origin:any, callback:any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable cookies and HTTP authentication
};


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies or sessions
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
}); 
 

app.use('/api/user', userRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/socialAuth', socialRoutes);

export default app;