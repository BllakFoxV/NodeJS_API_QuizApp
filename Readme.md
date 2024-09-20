# Quiz App API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
3. [API Reference](#api-reference)
   - [Authentication](#authentication)
   - [User](#user)
   - [Quiz](#quiz)
   - [Admin](#admin)
4. [Database Schema](#database-schema)
5. [Error Handling](#error-handling)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

This API serves as the backend for a Quiz Application, providing endpoints for user authentication, quiz management, and administrative functions.

### Base URL
`http://localhost:3000/api`

### Authentication
Most endpoints require a JWT token in the Authorization header:
`Authorization: Bearer <token>`

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MySQL (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quiz-app-api.git
   cd quiz-app-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=quiz
     JWT_SECRET=your_jwt_secret
     SECRET_KEY=your_secret_key
     JWT_EXPIRES_IN=24h
     ```

4. Initialize the database:
   ```bash
   node src/db/initDB.mjs
   ```

### Configuration

The application uses environment variables for configuration. Ensure all required variables are set in your `.env` file or in your deployment environment.

## API Reference

### Authentication

#### Register
- **POST** `/auth/register`
- **Body**: 
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Thành Công"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body**: 
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Thành Công",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### User

#### Get User Info
- **GET** `/user/info`
- **Auth**: Required
- **Response**: 
  ```json
  {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "fullname": "John Doe",
      "email": "john@example.com",
      "is_active": true
    },
    "history": [
      {
        "id": "789e0123-e45b-67d8-a901-234567890000",
        "score": 80,
        "questions_answered": 10,
        "time_taken": 300
      }
    ],
    "last_score": 80
  }
  ```

### Quiz

#### Get Quiz Question
- **GET** `/quiz`
- **Auth**: Required
- **Response**: 
  ```json
  {
    "data": {
      "question": {
        "id": "456e7890-e12b-34d5-a678-901234567000",
        "text": "What is the capital of France?",
        "option_a": "London",
        "option_b": "Berlin",
        "option_c": "Paris",
        "option_d": "Madrid"
      }
    }
  }
  ```

#### Get Multiple Questions
- **GET** `/quiz/get-package`
- **Query**: `count` (optional, default: 10)
- **Auth**: Required
- **Response**: 
  ```json
  {
    "data": {
      "questions": [
        {
          "id": "456e7890-e12b-34d5-a678-901234567000",
          "text": "What is the capital of France?",
          "option_a": "London",
          "option_b": "Berlin",
          "option_c": "Paris",
          "option_d": "Madrid"
        },
        // ... more questions
      ]
    }
  }
  ```

#### Validate Quiz Answer
- **POST** `/quiz`
- **Auth**: Required
- **Body**: 
  ```json
  {
    "question_id": "456e7890-e12b-34d5-a678-901234567000",
    "answer": "Paris"
  }
  ```
- **Response**: 
  ```json
  {
    "data": {
      "is_correct": true,
      "correct_answer": "Paris",
      "user_answer": "Paris"
    }
  }
  ```

### Admin

#### Authenticate Admin
- **GET** `/admin/auth`
- **Auth**: Admin Required
- **Response**: 
  ```json
  {
    "is_admin": true,
    "fullname": "Admin User"
  }
  ```

#### Get Users
- **GET** `/admin/users`
- **Auth**: Admin Required
- **Query**: 
  - `count` (default: 10)
  - `page` (default: 1)
- **Response**: 
  ```json
  {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "fullname": "John Doe",
        "email": "john@example.com",
        "is_active": true,
        "is_admin": false
      },
      // ... more users
    ],
    "total_users": 100
  }
  ```

#### Set User Active Status
- **POST** `/admin/users/set-active`
- **Auth**: Admin Required
- **Body**: 
  ```json
  {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "is_active": true
  }
  ```
- **Response**: 
  ```json
  {
    "ok": true
  }
  ```

#### Delete User
- **DELETE** `/admin/users/:user_id`
- **Auth**: Admin Required
- **Response**: 
  200 OK
  ```json
  {
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "fullname": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Get All Questions
- **GET** `/admin/all-questions`
- **Auth**: Admin Required
- **Response**: 
  ```json
  {
    "questions": [
      {
        "id": "456e7890-e12b-34d5-a678-901234567000",
        "text": "What is the capital of France?",
        "option_a": "London",
        "option_b": "Berlin",
        "option_c": "Paris",
        "option_d": "Madrid",
        "correct_answer": "C"
      },
      // ... more questions
    ]
  }
  ```

#### Get Paginated Questions
- **GET** `/admin/questions`
- **Auth**: Admin Required
- **Query**: 
  - `count` (default: 10)
  - `page` (default: 1)
- **Response**: 
  ```json
  {
    "data": {
      "questions": [
        {
          "id": "456e7890-e12b-34d5-a678-901234567000",
          "text": "What is the capital of France?",
          "option_a": "London",
          "option_b": "Berlin",
          "option_c": "Paris",
          "option_d": "Madrid",
          "correct_answer": "C"
        },
        // ... more questions
      ],
      "total_questions": 100
    }
  }
  ```

#### Update Question
- **PUT** `/admin/questions/:question_id`
- **Auth**: Admin Required
- **Body**: 
  ```json
  {
    "text": "What is the capital of France?",
    "option_a": "London",
    "option_b": "Berlin",
    "option_c": "Paris",
    "option_d": "Madrid",
    "correct_answer": "C"
  }
  ```
- **Response**: 
    200 OK
  ```json
  {
    "data": {
      "id": "456e7890-e12b-34d5-a678-901234567000",
      "text": "What is the capital of France?",
      "option_a": "London",
      "option_b": "Berlin",
      "option_c": "Paris",
      "option_d": "Madrid",
      "correct_answer": "C"
    }
  }
  ```

#### Delete Question
- **DELETE** `/admin/questions/:question_id`
- **Auth**: Admin Required
- **Response**: 
  ```json
  {
    "data": {
      "id": "456e7890-e12b-34d5-a678-901234567000",
      "text": "What is the capital of France?"
    }
  }
  ```

#### Create Question
- **POST** `/admin/questions`
- **Auth**: Admin Required
- **Body**: 
  ```json
  {
    "text": "What is the largest planet in our solar system?",
    "option_a": "Mars",
    "option_b": "Jupiter",
    "option_c": "Saturn",
    "option_d": "Neptune",
    "correct_answer": "B"
  }
  ```
- **Response**: 
  200 OK
  ```json
  {
    "ok": true
  }
  ```

## Database Schema

The application uses the following database tables:

### Users
- `id` (CHAR(36), Primary Key) // uuid, Auto generate
- `fullname` (VARCHAR(255))
- `email` (VARCHAR(255), Unique)
- `password` (VARCHAR(255))
- `is_active` (BOOLEAN)
- `is_admin` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `salt` (VARCHAR(255))

### Questions
- `id` (CHAR(36), Primary Key) // uuid, Auto generate
- `text` (TEXT)
- `option_a` (TEXT)
- `option_b` (TEXT)
- `option_c` (TEXT)
- `option_d` (TEXT)
- `correct_answer` (CHAR(1))
- `created_at` (TIMESTAMP)

### Quiz Results
- `id` (CHAR(36), Primary Key)  // uuid, Auto generate
- `user_id` (CHAR(36), Foreign Key to Users)
- `score` (INT)
- `questions_answered` (INT)
- `time_taken` (INT)
- `created_at` (TIMESTAMP)

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. In case of errors, the response will include an `error_code` and an error message. Refer to `src/constants/errorCode.mjs` for a list of possible error codes.

Example error response:
```json
{
  "error_code": "INVALID_CREDENTIALS",
  "error": "Email or password is incorrect"
}
```

## Deployment

### Production Build
1. Ensure all environment variables are correctly set for production.
2. Build the project:
   ```bash
   npm run build
   ```

### Deployment Options

#### Option 1: Traditional Hosting
1. Transfer the built files to your hosting server.
2. Install production dependencies:
   ```bash
   npm install --production
   ```
3. Start the server:
   ```bash
   npm start
   ```

#### Option 2: Docker
1. Build the Docker image:
   ```bash
   docker build -t quiz-app-api .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 -e DB_HOST=host.docker.internal quiz-app-api
   ```

#### Option 3: Cloud Platforms
The app can be deployed to cloud platforms like Heroku, AWS, or Google Cloud Platform. Follow the platform-specific instructions for Node.js applications.

## Testing

To run the test suite:
```bash
npm test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.