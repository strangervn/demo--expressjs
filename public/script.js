document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/employees/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.text();
    alert(data);
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/employees/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { token, role } = await response.json();
        localStorage.setItem('token', token);
        alert('Đăng nhập thành công!');
        loadEmployees();  // Gọi hàm tải danh sách nhân viên
    } else {
        alert('Đăng nhập thất bại!');
    }
});

async function loadEmployees() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Bạn cần đăng nhập trước khi xem danh sách nhân viên.');
        return;
    }

    const response = await fetch('/api/employees', {
        headers: {
            'Authorization': token,
        },
    });

    if (response.ok) {
        const employees = await response.json();
        const employeeList = document.getElementById('employeeList');
        employeeList.innerHTML = `
            <h2>Danh sách Nhân viên</h2>
            <table>
                <thead>
                    <tr>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Vai Trò</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(employee => `
                        <tr>
                            <td>${employee.name}</td>
                            <td>${employee.email}</td>
                            <td>${employee.role}</td>
                            <td>
                                <button onclick="showUpdateForm('${employee._id}', '${employee.name}', '${employee.email}', '${employee.role}')">Cập nhật</button>
                                <button onclick="deleteEmployee('${employee._id}')">Xóa</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        const addButton = document.createElement('button');
        addButton.innerText = 'Thêm Nhân viên';
        addButton.onclick = showAddForm;
        employeeList.appendChild(addButton);
    } else {
        alert('Không thể tải danh sách nhân viên.');
    }
}

function showAddForm() {
    const name = prompt("Nhập tên nhân viên:");
    const email = prompt("Nhập email nhân viên:");
    const password = prompt("Nhập mật khẩu nhân viên:");
    const role = prompt("Nhập vai trò nhân viên (admin/employee):");

    addEmployee(name, email, password, role);
}

async function addEmployee(name, email, password, role) {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/employees/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
        alert('Nhân viên đã được thêm thành công!');
        loadEmployees();  // Tải lại danh sách nhân viên
    } else {
        alert('Có lỗi xảy ra khi thêm nhân viên.');
    }
}

function showUpdateForm(id, name, email) {
    const newName = prompt("Nhập tên mới:", name);
    const newEmail = prompt("Nhập email mới:", email);
    const newRole = prompt("Nhập vai trò mới (admin/employee):");

    updateEmployee(id, newName, newEmail, newRole);
}

async function updateEmployee(id, name, email, role) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ name, email, role }),
    });

    if (response.ok) {
        alert('Cập nhật thành công!');
        loadEmployees();  // Tải lại danh sách nhân viên
    } else {
        alert('Có lỗi xảy ra khi cập nhật.');
    }
}

async function deleteEmployee(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token,
        },
    });

    if (response.ok) {
        alert('Nhân viên đã được xóa thành công!');
        loadEmployees();  // Tải lại danh sách nhân viên
    } else {
        alert('Có lỗi xảy ra khi xóa nhân viên.');
    }
}