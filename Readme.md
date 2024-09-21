# Quiz App API Documentation

## Overview
This API serves a quiz application, handling user authentication, quiz management, and administrative functions.

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- MySQL database

### Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd quiz-app-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   SECRET_KEY=your_secret_key
   ```

4. Initialize the database:
   Run the SQL scripts provided in the `db` folder to create the necessary tables.

5. Start the server:
   ```
   npm run dev
   ```

   The server will start on `http://localhost:3000` (or the port specified in your .env file).

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication
#### Register
- **POST** `/auth/register`
- **Body**: `{ fullname, email, password }`
- **Response**: `{ message: "Thành Công" }`

#### Login
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ message: "Thành Công", token }`

### User
#### Get User Info
- **GET** `/user/info`
- **Auth**: Required
- **Response**: `{ user: {...}, history: [...], last_score }`

#### Update User Score
- **POST** `/user/update-score`
- **Auth**: Required
- **Body**: `{ score, result_id }`
- **Response**: `{ message: "Score updated" }`

#### Update Password
- **POST** `/user/update-password`
- **Auth**: Required
- **Body**: `{ old_password, new_password }`
- **Response**: `{ message: "Password updated" }`

### Quiz
#### Get Random Question
- **GET** `/quiz`
- **Auth**: Required
- **Response**: `{ question: {...} }`

#### Get Question Package
- **GET** `/quiz/get-package`
- **Auth**: Required
- **Query**: `count`
- **Response**: `{ questions: [...], result_id }`

#### Validate Quiz Answer
- **POST** `/quiz`
- **Auth**: Required
- **Body**: `{ question_id, answer }`
- **Response**: `{ is_correct, correct_answer, user_answer }`

### Admin
#### Admin Authentication
- **GET** `/admin/auth`
- **Auth**: Admin Required
- **Response**: `{ is_admin, fullname }`

#### Get All Users
- **GET** `/admin/users`
- **Auth**: Admin Required
- **Query**: `count, page`
- **Response**: `{ users: [...], total_users }`

#### Set User Active Status
- **POST** `/admin/users/set-active`
- **Auth**: Admin Required
- **Body**: `{ user_id, is_active }`
- **Response**: `{ ok: true }`

#### Delete User
- **DELETE** `/admin/users/:user_id`
- **Auth**: Admin Required
- **Response**: `{ data: {...} }`

#### Get All Questions
- **GET** `/admin/questions`
- **Auth**: Admin Required
- **Query**: `count`
- **Response**: `{ data: { questions: [...], total_questions } }`

#### Update Question
- **PUT** `/admin/questions/:question_id`
- **Auth**: Admin Required
- **Body**: `{ text, option_a, option_b, option_c, option_d, correct_answer }`
- **Response**: `{ data: {...} }`

#### Delete Question
- **DELETE** `/admin/questions/:question_id`
- **Auth**: Admin Required
- **Response**: `{ data: {...} }`

#### Create Question
- **POST** `/admin/questions`
- **Auth**: Admin Required
- **Body**: `{ text, option_a, option_b, option_c, option_d, correct_answer }`
- **Response**: `{ ok: true }`

## Models

### User
- id (UUID)
- fullname (String)
- email (String)
- password (Hashed String)
- is_active (Boolean)
- is_admin (Boolean)
- created_at (Date)

### Question
- id (UUID)
- text (String)
- option_a (String)
- option_b (String)
- option_c (String)
- option_d (String)
- correct_answer (String)

### QuizResult
- id (UUID)
- user_id (UUID)
- score (Number)
- total_questions (Number)
- time_taken (Number)
- created_at (Date)

## Error Handling
Errors are returned with appropriate HTTP status codes and an error object:
```json
{
  "error_code": "ERROR_CODE",
  "error": "Error message"
}
```

## Environment Variables
- PORT: Server port (default: 3000)
- DB_HOST: Database host
- DB_USER: Database user
- DB_PASSWORD: Database password
- DB_NAME: Database name
- JWT_SECRET: Secret for JWT signing
- JWT_EXPIRES_IN: JWT expiration time
- SECRET_KEY: Additional secret key for password hashing