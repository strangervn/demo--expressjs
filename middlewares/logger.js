// middlewares/logger.js

export const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

// Sử dụng middleware logger trong app.js
import { logger } from './middlewares/logger.js';

app.use(logger);