import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import { config } from './configs/env.configs';



const app: Application = express();

const allowedOrigins = [
  'https://task-management-app-one-blue.vercel.app',
  'https://task-management-4449px69v-jackson-cheriyans-projects.vercel.app'
];

// const corsOptions = {
//   origin: (origin:any, callback:any) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // Enable cookies and HTTP authentication
// };

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;