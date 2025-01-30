# User Service for Learning Platform

A microservice-based user management system built with Node.js, Express, and MongoDB. This service handles user operations for a learning platform, including user creation, authentication, and profile management.

## Features

- User CRUD operations
- MongoDB integration
- Docker containerization
- Logging system
- Error handling
- API documentation
- Containerized development environment

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (if running locally)
- npm or yarn

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd user-service
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Build and run the containers:
```bash
docker-compose up --build
```

The service will be available at `http://localhost:3000`

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the service:
```bash
npm run dev
```

## API Endpoints

### Users

- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get a specific user
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

### Health Check

- `GET /health` - Service health check

## Project Structure

```
user-service/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── controllers/
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── error-handler.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── index.js
│   │   └── user.routes.js
│   └── app.js
├── tests/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run test:coverage` - Run tests with coverage report

## Docker Commands

Build and start services:
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

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Node environment (development/production)
- Other environment variables as needed

## Logging

Logs are stored in the `logs` directory:
- `error.log` - Error logs
- `combined.log` - All logs

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Error Handling

The service includes centralized error handling with:
- Custom error classes
- Error logging
- Standardized error responses

## Security

- CORS enabled
- Helmet security headers
- Rate limiting
- Input validation
- Password hashing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please email [support@example.com](mailto:support@example.com)