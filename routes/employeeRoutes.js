import { Router } from 'express';
import Employee from '../models/employee.js'; // Giả định Employee là mô hình Mongoose
import { authenticate, authorize } from '../middlewares/auth.js';
import bcrypt from 'bcryptjs'; // Import toàn bộ mô-đun bcryptjs
import jwt from 'jsonwebtoken'; // Import toàn bộ mô-đun jsonwebtoken

const router = Router();

// Đăng ký nhân viên
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Sử dụng hash từ bcrypt
    const employee = new Employee({ name, email, password: hashedPassword });
    await employee.save();
    res.status(201).send('Employee registered');
});

// Đăng nhập nhân viên
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email }); // Sử dụng mô hình để tìm
    if (!employee || !(await bcrypt.compare(password, employee.password))) { // Sử dụng compare từ bcrypt
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Sử dụng sign từ jwt
    res.json({ token });
});

// Lấy danh sách nhân viên (chỉ dành cho admin)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    const employees = await Employee.find(); // Sử dụng mô hình để lấy danh sách
    res.json(employees);
});

export default router;