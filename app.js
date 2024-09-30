import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import employeeRoutes from './routes/employeeRoutes.js';
import { join, dirname } from 'path';
import errorHandler from './middlewares/errorHandler.js'; // Import error handler
import dotenv from 'dotenv'; // Import dotenv
import { fileURLToPath } from 'url'; // Import để lấy đường dẫn tệp

dotenv.config(); // Sử dụng dotenv để cấu hình biến môi trường từ .env

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'public'))); // Sử dụng __dirname

// Kết nối đến MongoDB
connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Kết nối đến MongoDB thành công!');
})
.catch(err => {
    console.error('Kết nối đến MongoDB thất bại:', err);
});

// Đăng ký các route
app.use('/api/employees', employeeRoutes);

// Sử dụng middleware xử lý lỗi
app.use(errorHandler);

// Lắng nghe trên cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});