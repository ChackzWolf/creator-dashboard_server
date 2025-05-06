"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import userRoutes from './routes/user.js'
// import socialRoutes from './routes/socialAuth.js'
const app = (0, express_1.default)();
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
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });
// console.log(userRoutes);  // Should log the router, not undefined
// console.log(socialRoutes); // Same here
// app.use('/api/user', userRoutes);
// app.use('/api/socialAuth', socialRoutes);
exports.default = app;
