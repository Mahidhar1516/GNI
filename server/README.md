# Node.js + Express Backend Setup Guide

This is a placeholder guide for setting up your Node.js/Express backend server.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- SQL Database (MySQL, PostgreSQL, etc.)

## Quick Start

### 1. Initialize Node.js Project
```bash
mkdir server
cd server
npm init -y
```

### 2. Install Dependencies
```bash
npm install express cors dotenv bcrypt jsonwebtoken
npm install --save-dev nodemon typescript @types/node @types/express
```

### 3. Create Basic Express Server (server.js)
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/schedule', require('./routes/schedule'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Environment Variables (.env)
```
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 5. Database Connection Example
```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
```

### 6. Example Route Structure

#### routes/auth.js
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add your authentication logic here
    res.json({ token: 'jwt_token', user: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    // Add your registration logic here
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 7. Middleware Examples

#### middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
```

## Project Structure
```
server/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── noticeController.js
│   ├── placementController.js
│   └── scheduleController.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── courses.js
│   ├── notices.js
│   ├── placements.js
│   └── schedule.js
├── models/
│   └── (optional ORM models)
├── .env
├── package.json
└── server.js
```

## Connect Frontend to Backend

Update your React app's `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

## Next Steps
1. Set up your SQL database using the schema in `/database/schema.sql`
2. Create the route files mentioned above
3. Implement controllers for business logic
4. Add authentication middleware
5. Test API endpoints with Postman or similar tools
6. Update the frontend to use the actual API endpoints
