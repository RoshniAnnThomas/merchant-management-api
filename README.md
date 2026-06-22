# Merchant Management API

REST API for managing merchant categories and merchants with admin JWT authentication.

## Features

- Admin login with JWT
- Protected category and merchant routes
- Category collection
- Merchant collection with Category ObjectId reference
- Unique merchant registration number
- Merchant CRUD operations
- Centralized error handling
- Default admin seed script
- Postman collection

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/merchant_management_api
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=1d
```

## Sample `.env.example`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/merchant_management_api
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
```

## Running Locally

Start MongoDB locally or use a MongoDB Atlas connection string in `MONGO_URI`.

Create the default admin user:

```bash
npm run seed:admin
```

Default credentials:

```text
email: admin@example.com
password: admin123
```

Run the API in development mode:

```bash
npm run dev
```

Run the API in production mode:

```bash
npm start
```

Base URL:

```text
http://localhost:5000
```

## API List

### Auth

```text
POST /api/auth/login
```

Sample body:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Categories

Protected route. Send JWT token in the Authorization header:

```text
Authorization: Bearer <token>
```

```text
POST /api/categories
```

Sample body:

```json
{
  "name": "Grocery",
  "description": "Daily grocery and supermarket merchants"
}
```

### Merchants

All merchant routes are protected. Send JWT token in the Authorization header:

```text
Authorization: Bearer <token>
```

```text
POST   /api/merchants
GET    /api/merchants
GET    /api/merchants/:id
PATCH  /api/merchants/edit/:id
DELETE /api/merchants/:id
```

Sample create merchant body:

```json
{
  "shopName": "Fresh Mart",
  "phoneNumber": "+91 9876543210",
  "ownerName": "Rahul Sharma",
  "registrationNumber": "REG-1001",
  "category": "CATEGORY_OBJECT_ID",
  "address": "12 Market Road, Mumbai"
}
```

## Postman Collection

Import this file into Postman:

```text
postman/Merchant_Management_API.postman_collection.json
```

Run `Admin Login` first to save the JWT token, then create a category, then use the merchant APIs.
