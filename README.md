# 💸 Personal Expense Management System – MERN Stack

A full-stack expense management application built with **MongoDB, Express, React, Node.js**.

---

## 📁 Project Structure

```
expense-app/
├── backend/
│   ├── models/
│   │   ├── User.js          ← User schema (bcrypt hashed password)
│   │   └── Expense.js       ← Expense schema (linked to User)
│   ├── routes/
│   │   ├── auth.js          ← POST /register, POST /login
│   │   └── expenses.js      ← POST /expense, GET /expenses, DELETE /expense/:id
│   ├── middleware/
│   │   └── auth.js          ← JWT verification middleware
│   ├── server.js            ← Express server entry point
│   ├── .env.example         ← Environment variable template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx          ← All React components (Auth + Dashboard)
    │   └── main.jsx         ← React DOM entry
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

---

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server
npm start          # production
npm run dev        # development (nodemon)
```

Server runs at: **http://localhost:5000**

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at: **http://localhost:3000**

---

## 🔌 REST API Reference

### Auth Routes (Public)

| Method | Endpoint    | Description              | Body                             |
|--------|-------------|--------------------------|----------------------------------|
| POST   | /register   | Register a new user      | `{ name, email, password }`      |
| POST   | /login      | Login & get JWT token    | `{ email, password }`            |

**Sample Register Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "name": "John", "email": "john@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Expense Routes (Protected – require Bearer token)

| Method | Endpoint          | Description                    | Body / Query                          |
|--------|-------------------|--------------------------------|---------------------------------------|
| POST   | /expense          | Add a new expense              | `{ title, amount, category, date }`  |
| GET    | /expenses         | Get all user expenses          | `?category=Food&sort=amount`         |
| DELETE | /expense/:id      | Delete an expense              | –                                     |

**Authorization Header:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🗄️ MongoDB Schemas

### User Schema
```js
{
  name:      String (required)
  email:     String (unique, required)
  password:  String (bcrypt hashed, required)
  timestamps: true
}
```

### Expense Schema
```js
{
  user:      ObjectId (ref: 'User', required)
  title:     String (required)
  amount:    Number (required, > 0)
  category:  Enum ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Education', 'Other']
  date:      Date (default: now)
  notes:     String (optional)
  timestamps: true
}
```

---

## 🔐 Authentication Flow

1. User registers → password hashed with **bcrypt (salt rounds: 10)**
2. User logs in → **JWT token** generated (expires in 7 days)
3. Token stored in **localStorage** on frontend
4. Protected routes use **auth middleware** to:
   - Extract `Bearer <token>` from `Authorization` header
   - Verify token with `jwt.verify()`
   - Attach `req.user` for downstream use

---

## ⚛️ React Frontend Features

- **Register Page** – Form with validation (name, email, password)
- **Login Page** – Email/password authentication
- **Dashboard** – Expense list with stats, filters, total
- **Add Expense Modal** – Title, amount, category, date, notes
- **Category Filter** – Filter expenses by category (Bonus ✅)
- **Total Display** – Running total of all expenses (Bonus ✅)
- **Delete Expense** – Remove any expense
- **JWT in localStorage** – Persists across page refresh
- **Auth Context** – Global auth state with React Context API

---

## 🧪 Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Add Expense (replace TOKEN)
curl -X POST http://localhost:5000/expense \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Lunch","amount":250,"category":"Food","date":"2024-01-15"}'

# Get Expenses
curl http://localhost:5000/expenses \
  -H "Authorization: Bearer TOKEN"
```

---

## 📦 Dependencies

### Backend
| Package      | Purpose                  |
|-------------|--------------------------|
| express      | Web framework            |
| mongoose     | MongoDB ODM              |
| bcryptjs     | Password hashing         |
| jsonwebtoken | JWT auth                 |
| cors         | Cross-Origin Resource Sharing |
| dotenv       | Environment variables    |

### Frontend
| Package        | Purpose             |
|---------------|---------------------|
| react          | UI library          |
| react-dom      | DOM rendering       |
| vite           | Build tool / dev server |

---

## ✅ Marking Criteria Coverage

| Part | Requirement | Status |
|------|------------|--------|
| A1 | User Schema (name, email, hashed password) | ✅ |
| A2 | Expense Schema (userId ref, title, amount, category, date) | ✅ |
| A3 | POST /register | ✅ |
| A3 | POST /login + JWT | ✅ |
| A3 | POST /expense (protected) | ✅ |
| A3 | GET /expenses (protected) | ✅ |
| B1 | JWT generation on login | ✅ |
| B1 | Protected routes middleware | ✅ |
| B2 | Auth middleware (verify + attach user) | ✅ |
| C1 | Register Page | ✅ |
| C1 | Login Page | ✅ |
| C1 | Dashboard (Expense List) | ✅ |
| C2 | Form handling | ✅ |
| C2 | JWT in localStorage | ✅ |
| C2 | Fetch & display expenses | ✅ |
| D1 | Add new expenses | ✅ |
| D1 | View all expenses | ✅ |
| D2 | Filter by category (Bonus) | ✅ |
| D2 | Total expense amount (Bonus) | ✅ |
