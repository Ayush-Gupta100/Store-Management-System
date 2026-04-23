# Lost and Found Item Management System (MERN)

This project has been converted from an expense tracker to a Lost and Found system while keeping the same core full-stack logic (auth + protected CRUD + dashboard flow).

## Tech Stack
- MongoDB + Mongoose
- Express + Node.js
- React (Vite)
- JWT Authentication
- bcrypt password hashing
- Axios for frontend API calls

## Backend API (as required)
Base URL: http://localhost:5000/api

### Auth APIs
- POST /register
- POST /login

### Item APIs (protected)
- POST /items           -> Add item
- GET /items            -> View all items
- GET /items/:id        -> View item by ID
- PUT /items/:id        -> Update item
- DELETE /items/:id     -> Delete item
- GET /items/search?name=xyz&type=Lost|Found -> Search items

### Extra protected route
- GET /dashboard

## MongoDB Schemas

### User
- name
- email (unique)
- password (hashed using bcrypt pre-save hook)

### Item
- user (ObjectId ref User)
- itemName
- description
- type (Lost / Found)
- location
- date
- contactInfo

## Frontend Features
- Registration form (name, email, password)
- Login form (email, password)
- Dashboard with:
  - Add item form
  - Display all items
  - Search by name/type
  - Update and delete actions
  - Logout
- JWT token stored in localStorage after login
- Unauthorized handling and duplicate/invalid credential error messages

## Run Locally

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Important Environment Variables
Create backend/.env:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000

Optional frontend env:

VITE_API=http://localhost:5000/api
