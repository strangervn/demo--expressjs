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
        const { token } = await response.json();
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
        employeeList.innerHTML = '<h2>Danh sách Nhân viên</h2>';
        employees.forEach(employee => {
            employeeList.innerHTML += `<p>${employee.name} (${employee.email})</p>`;
        });
    } else {
        alert('Không thể tải danh sách nhân viên.');
    }
}