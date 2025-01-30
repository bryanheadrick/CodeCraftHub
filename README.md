# User Service API

A microservice for user management and authentication in a learning platform.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Docker Setup](#docker-setup)

## Features

- User Authentication (Register, Login)
- Email Verification
- Password Reset
- Role-based Access Control
- User Profile Management
- Admin User Management
- Protected Routes
- Docker Support

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Docker
- JWT Authentication
- Bcrypt for Password Hashing
- Nodemailer for Email Services

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker and Docker Compose (optional)

### Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd user-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm run dev
```

### Docker Setup

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register
```
Request Body:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
}
```
Response:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "role": "student"
        },
        "token": "JWT_TOKEN"
    }
}
```

#### Login
```
POST /api/v1/auth/login
```
Request Body:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
Response:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "role": "student"
        },
        "token": "JWT_TOKEN"
    }
}
```

#### Forgot Password
```
POST /api/v1/auth/forgot-password
```
Request Body:
```json
{
    "email": "john@example.com"
}
```
Response:
```json
{
    "success": true,
    "message": "Password reset email sent"
}
```

#### Reset Password
```
POST /api/v1/auth/reset-password/:token
```
Request Body:
```json
{
    "password": "newpassword123"
}
```
Response:
```json
{
    "success": true,
    "message": "Password reset successful"
}
```

### Protected User Endpoints
All these endpoints require authentication token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

#### Get Own Profile
```
GET /api/v1/users/me
```
Response:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "role": "student"
        }
    }
}
```

#### Update Own Profile
```
PUT /api/v1/users/me
```
Request Body:
```json
{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com"
}
```
Response:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

### Admin Endpoints
Requires admin role and authentication token.

#### Get All Users
```
GET /api/v1/users?page=1&limit=10
```
Response:
```json
{
    "success": true,
    "count": 10,
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "pages": 10
    },
    "data": [
        {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "role": "student"
        }
        // ... more users
    ]
}
```

#### Get User by ID
```
GET /api/v1/users/:id
```
Response:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "role": "student"
        }
    }
}
```

#### Update User Role
```
PUT /api/v1/users/:id/role
```
Request Body:
```json
{
    "role": "instructor"
}
```
Response:
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "role": "instructor"
        }
    }
}
```

#### Delete User
```
DELETE /api/v1/users/:id
```
Response:
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

## Error Responses

All endpoints return error responses in the following format:
```json
{
    "success": false,
    "message": "Error message",
    "error": {
        "statusCode": 400,
        "details": "Additional error details"
    }
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/learning-platform
JWT_SECRET=your-jwt-secret
NODE_ENV=development
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@example.com
APP_URL=http://localhost:3000
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```