"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = __importDefault(require("./configs/db.js"));
const env_configs_js_1 = require("./configs/env.configs.js");
const PORT = env_configs_js_1.config.PORT || 5000;
(0, db_js_1.default)();
const server = http_1.default.createServer(app_js_1.default);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
