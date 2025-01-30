# User Service

A simple user authentication service with Node.js, Express, and MongoDB.

## Features

- User registration and login
- JWT Authentication
- Protected user profile route
- Docker development environment with hot reloading

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Docker & Docker Compose
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd user-service
```

2. Start the services:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Development

The application uses nodemon for hot reloading. Any changes to the source files will automatically restart the server.

### Database Management

To reset the database:
```bash
# Remove MongoDB volume and containers
docker-compose down -v

# Or, to just drop the database:
docker exec -it mongodb mongosh learning-platform --eval "db.dropDatabase()"
```

## API Endpoints

### Public Routes

#### Register User
```
POST /auth/register

Request:
{
    "username": "john",
    "password": "password123"
}

Response:
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "username": "john"
        },
        "token": "JWT_TOKEN"
    }
}
```

#### Login User
```
POST /auth/login

Request:
{
    "username": "john",
    "password": "password123"
}

Response:
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "username": "john"
        },
        "token": "JWT_TOKEN"
    }
}
```

### Protected Routes

#### Get User Profile
```
GET /users/me
Headers:
Authorization: Bearer JWT_TOKEN

Response:
{
    "success": true,
    "data": {
        "user": {
            "id": "user_id",
            "username": "john"
        }
    }
}
```

### Health Check
```
GET /health

Response:
{
    "status": "success",
    "message": "User Service API",
    "timestamp": "2025-01-30T..."
}
```

## Error Responses

All endpoints return error responses in the following format:
```json
{
    "success": false,
    "message": "Error message",
    "errors": ["Detailed error message"]
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/learning-platform
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

## Docker Commands

Start services:
```bash
docker-compose up
```

Rebuild and start services:
```bash
docker-compose up --build
```

Stop services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f app
```

## Project Structure
```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── auth.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.js
│   ├── error-handler.js
│   └── validate.js
├── models/
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── index.js
└── app.js
```