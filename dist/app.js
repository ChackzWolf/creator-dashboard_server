"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const admin_js_1 = __importDefault(require("./routes/admin.js"));
const socialAuth_js_1 = __importDefault(require("./routes/socialAuth.js"));
const app = (0, express_1.default)();
const allowedOrigins = [
    'https://creator-dashboard-client.web.app',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Enable cookies and HTTP authentication
};
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true, // if you're using cookies or sessions
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});
app.use('/api/user', user_js_1.default);
app.use('/api/admin', admin_js_1.default);
app.use('/api/socialAuth', socialAuth_js_1.default);
exports.default = app;
