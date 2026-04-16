# Learn Vibe Coding (API Backend)

This is a robust, type-safe RESTful API backend built to handle user authentication, registration, session management, and related functionalities. Designed with modern technologies, it leverages speed and strong typing while maintaining clear separation of concerns in its architecture.

---

## 🛠 Technology Stack

This project is built using a modern JavaScript/TypeScript ecosystem focused on performance and developer experience:

- **Runtime & Package Manager**: [Bun](https://bun.sh/) (v1.3.1+)
- **Web Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (with `drizzle-kit` for migrations)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: Custom Bearer Token (Session-based via DB)
- **Testing**: Bun's native test runner (`bun:test`) & Supertest

---

## 📂 Architecture and File Structure

The project follows a standard layered architecture to keep routing, business logic, validation, and data access decoupled.

```
learn-vibe-coding/
├── src/
│   ├── app.ts                  # Setup Express app, middlewares, and routes
│   ├── index.ts                # Application entry point (server listener)
│   ├── controllers/            # Handles incoming HTTP requests and structures responses
│   │   └── user-controller.ts
│   ├── db/                     # Database configuration and schemas
│   │   ├── index.ts            # Drizzle client setup
│   │   └── schema.ts           # PostgreSQL table definitions
│   ├── middlewares/            # Express middlewares
│   │   ├── auth-middleware.ts  # Token verification logic
│   │   ├── error-middleware.ts # Global error handler
│   │   └── validate-middleware.ts # Request body validation mapping Zod
│   ├── routes/                 # API endpoint routing
│   │   └── users-route.ts
│   ├── services/               # Core business logic and database operations
│   │   └── users-service.ts
│   ├── types/                  # Shared TypeScript interfaces
│   │   └── auth.ts
│   ├── utils/                  # Helper utilities
│   │   └── api-response.ts     # Standardized JSON response wrapper
│   └── validators/             # Zod validation schemas
│       └── user-validator.ts
├── tests/                      # Unit and integration tests
│   ├── users.test.ts           # Test scenarios for the Users API
│   └── utils.ts                # Database cleardown and test helpers
├── .env                        # Environment variables (not committed)
├── package.json                # Project dependencies and scripts
└── bun.lock                    # Dependency lockfile
```

---

## ☁️ Available API Endpoints

Base URL: `/api/v1`

### 1. Register User
- **Endpoint**: `POST /users`
- **Description**: Creates a new user account if the email is not already registered.
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "strongpassword123"
  }
  ```
- **Responses**: 
  - `201 Created`: Returns user object (without password).
  - `400 Bad Request`: Validation failure or duplicate email.

### 2. Login User
- **Endpoint**: `POST /users/login`
- **Description**: Authenticates a user and generates a session token.
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "strongpassword123"
  }
  ```
- **Responses**: 
  - `200 OK`: Returns the Bearer token in the `data` field.
  - `400 Bad Request`: Validation failure or incorrect credentials.

### 3. Get Current User
- **Endpoint**: `GET /users/current`
- **Description**: Retrieves the profile for the currently authenticated user session.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Responses**: 
  - `200 OK`: Returns the current user's profile details.
  - `401 Unauthorized`: Missing, invalid, or expired session token.

### 4. Logout
- **Endpoint**: `DELETE /users/logout`
- **Description**: Invalidates and removes the current session token from the database.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Responses**: 
  - `200 OK`: Session successfully destroyed.
  - `401 Unauthorized`: Invalid or missing session token.

---

## 🗄 Database Schemas

The database structure is managed via **Drizzle ORM** inside `src/db/schema.ts`.

### `users` table
Stores the main profile data and credentials.
- `id`: Serial, Primary Key
- `firstname`: Varchar(255), Not Null
- `lastname`: Varchar(255), Not Null
- `email`: Varchar(255), Not Null, Unique
- `password`: Varchar(255), Not Null (BCrypt Hashed)
- `created_at`: Timestamp, default now()
- `updated_at`: Timestamp, default now()

### `sessions` table
Tracks authenticated sessions and mapped tokens.
- `id`: Serial, Primary Key
- `token`: Varchar(255), Not Null
- `user_id`: Integer, Not Null (Foreign key -> `users.id`)
- `created_at`: Timestamp, default now()

---

## 🛡 Validations (Zod Schemas)

Zod is utilized for strict, runtime boundary checking of incoming API requests. The schemas apply automatic conversions like `.trim()` and `.toLowerCase()`.

### `registerSchema`
```typescript
{
  firstname: string // required, trimmed, max 255
  lastname: string // required, trimmed, max 255
  email: string // required, trimmed, lowercase, valid email, max 255
  password: string // required, min length 6, max 255
}
```

### `loginSchema`
```typescript
{
  email: string // required, trimmed, lowercase, valid email, max 255
  password: string // required, max 255
}
```

---

## 🚀 Setup & Execution

### Prerequisites
1. Install [Bun](https://bun.sh/)
2. Install [PostgreSQL](https://www.postgresql.org/) and ensure it is running.

### 1. Installation
Clone the repo and navigate to the root directory, then run:

```bash
bun install
```

### 2. Environment Setup
Create a `.env` file in the root formatting the following keys:
*(Use your actual database URI)*
```env
PORT=3000
DATABASE_URL="postgres://postgres:password@localhost:5432/learnvibecoding"
```

### 3. Database Migration
Push your schema directly into the mapped Postgres database using drizzle-kit:
```bash
bun db:push
```

### 4. Running the Development Server
To run the server locally with Hot Module Replacement (HMR):
```bash
bun run dev
```
To run naturally without hot reload:
```bash
bun run start
```

---

## 🧪 Testing the App

The project contains a comprehensive set of automated tests built securely around native `bun:test` and `supertest`. 

> **Important**: The test suite **truncates** the database inside the setup hooks to ensure consistent environments. Point your `.env` connection to a safe database!

To execute the test suite locally:

```bash
NODE_ENV=test bun test
```
*Note: We pass `NODE_ENV=test` to indicate testing environments dynamically inside the app if needed, though mostly abstracted by our `app.ts` versus `index.ts` setup logic.*
