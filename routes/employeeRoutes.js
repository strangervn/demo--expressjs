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
// Thêm nhân viên
router.post('/add', authenticate, authorize('admin'), async (req, res) => {
    const { name, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
        return res.status(400).send('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Băm mật khẩu
    const employee = new Employee({ name, email, password: hashedPassword, role });
    await employee.save();
    res.status(201).send('Employee added successfully');
});
// Xóa nhân viên
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.send('Employee deleted successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});
// Sửa nhân viên theo ID
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10); // Băm mật khẩu nếu có
    if (role) updatedData.role = role;
    try {
        const employee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.send('Employee updated successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});
export default router;