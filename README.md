# Demo project(CRUD, authentication, authorization...)
# Setup project
	npm install express mongoose bcryptjs jsonwebtoken dotenv
 	npm install
# Run
	npm start
# Port: 3000
 	localhost:3000 
# Routes
 	api/employees
# Example:
	Login: localhost:3000/api/employees/login
# Role
- admin: After logging in, you will see the information of all users and can CRUD the information
- employee: Only valid login will be notified successfully
# .env: Configure your own database and security
	MONGODB_URI=mongodb://localhost:27017/your_database
	JWT_SECRET=your_jwt_secret

