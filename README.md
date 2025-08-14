# Library Management System

A simple library system to manage Books, Borrowers, and the Borrowing process.

**Tech Stack:**

- **Programming:** Node.js (Express)
- **Database:** PostgreSQL (via Sequelize)
- **API:** RESTful
- **Focus:** Clean schema, fast reads (search/list), proper HTTP status codes & error handling

---

## 1) Project Structure

```
library-management/
├── migrations/           # Sequelize migration files (DB setup scripts)
├── seeders/              # (optional) seed files
├── src/
│   ├── app.js            # Express app wiring
│   ├── config/
│   │   └── config.js     # Sequelize config (reads from .env)
│   ├── controllers/
│   │   ├── bookController.js
│   │   ├── borrowerController.js
│   │   └── borrowingController.js
│   ├── models/
│   │   ├── index.js      # Sequelize initialization & model loader
│   │   ├── book.js
│   │   ├── borrower.js
│   │   └── borrowing.js
│   └── routes/
│       ├── bookRoutes.js
│       ├── borrowerRoutes.js
│       └── borrowingRoutes.js
├── .env                  # environment variables
├── .sequelizerc          # points CLI to src/... and migrations/
├── package.json
└── server.js             # server entry point
```

---

## 2) Prerequisites

- Node.js (v18+ recommended)
- Docker (to run PostgreSQL easily)
- npm (bundled with Node)

---

## 3) Quick Start (Step-by-Step)

**Step 1 — Clone & install**

```sh
git clone <your-repo-url> library-management
cd library-management
npm install
```

**Step 2 — Environment variables (repo root: ./.env)**

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=library_db
```

**Step 3 — Start PostgreSQL in Docker**

```sh
docker run --name postgres_library \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=library_db \
  -p 5432:5432 \
  -d postgres
```

_(Skip if you already have a running PostgreSQL container)_

**Step 4 — Run database migrations (creates tables)**

```sh
npx sequelize-cli db:migrate
```

**Step 5 — Start the server**

```sh
node server.js
```

You should see:

```
✅ Database connected!
🚀 Server running on port 5000
```

---

## 4) Database Schema

**ER Diagram (logical):**

Books (1) ───────< Borrowings >─────── (1) Borrowers

**Tables**

- **Books**

  - id (PK, serial)
  - title (string, required)
  - author (string, required)
  - isbn (string, required, unique)
  - availableQuantity (int, default 0)
  - shelfLocation (string)
  - createdAt / updatedAt (timestamps)

- **Borrowers**

  - id (PK, serial)
  - name (string, required)
  - email (string, required, unique)
  - registeredDate (date, default now)
  - createdAt / updatedAt (timestamps)

- **Borrowings**
  - id (PK, serial)
  - borrowerId (FK → Borrowers.id, cascade on update/delete)
  - bookId (FK → Books.id, cascade on update/delete)
  - borrowDate (date, default now)
  - dueDate (date, required)
  - returnDate (date, nullable)
  - status (string: 'borrowed' or 'returned', default 'borrowed')
  - createdAt / updatedAt (timestamps)

**Indexing (read performance):**

- Books.isbn (unique → index auto-created)
- Borrowers.email (unique → index auto-created)
- Recommended for search: Books.title (btree), Books.author (btree)

---

## 5) API Documentation

**Base URL:** `http://localhost:5000`

### A) Books

- **Create a book**  
  `POST /books`  
  Body:

  ```json
  {
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt & David Thomas",
    "isbn": "9780201616224",
    "availableQuantity": 10,
    "shelfLocation": "A3"
  }
  ```

  Responses:  
  `201 Created` — returns created book  
  `400/409` — validation/unique ISBN error  
  `500` — server error

- **List all books**  
  `GET /books`  
  Response: `200 OK` — `[]` if none

- **Get a book by id**  
  `GET /books/:id`  
  Response: `200 OK` or `404 Not Found`

- **Update a book**  
  `PUT /books/:id`  
  Body (any updatable fields):

  ```json
  { "title": "New Title", "availableQuantity": 7 }
  ```

  Response: `200 OK` or `404 Not Found`

- **Delete a book**  
  `DELETE /books/:id`  
  Response: `200 OK` with `{ message }` or `404 Not Found`

- **Search books (case-insensitive)**  
  `GET /books/search?title=...&author=...&isbn=...`  
  Examples:  
  `/books/search?title=Pragmatic`  
  `/books/search?author=Andrew`  
  `/books/search?isbn=9780201616224`  
  Response: `200 OK` (array of matches), `404 Not Found` (no matches)

---

### B) Borrowers

- **Register borrower**  
  `POST /borrowers`  
  Body:

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "registeredDate": "2025-08-13"
  }
  ```

  Responses:  
  `201 Created`  
  `409 Conflict` — duplicate email  
  `500` — server error

- **List all borrowers**  
  `GET /borrowers` → `200 OK`

- **Get borrower by id**  
  `GET /borrowers/:id` → `200 OK` or `404 Not Found`

- **Update borrower**  
  `PUT /borrowers/:id`  
  Body:

  ```json
  { "name": "John Smith" }
  ```

  Response: `200 OK` or `404 Not Found`

- **Delete borrower**  
  `DELETE /borrowers/:id` → `200 OK` or `404 Not Found`

---

### C) Borrowing Process

- **Borrow a book**  
  `POST /borrowings`  
  Body:

  ```json
  { "borrowerId": 1, "bookId": 1, "dueDate": "2025-08-20" }
  ```

  Behavior:

  - Validates borrower & book exist
  - Fails with `400` if availableQuantity < 1
  - Creates a Borrowing record (status borrowed)
  - Decrements Books.availableQuantity  
    Responses:  
    `201 Created` — returns borrowing  
    `400/404` — validation not met  
    `500` — server error

- **Return a book**  
  `POST /borrowings/:id/return`  
  Behavior:

  - Sets status = "returned" and returnDate = now
  - Increments Books.availableQuantity
  - `400` if already returned  
    Responses: `200 OK`, `404 Not Found`

- **Books currently with a borrower**  
  `GET /borrowings/borrower/:borrowerId`  
  Behavior:

  - Returns borrowings for borrower where status = "borrowed"
  - Includes associated book  
    Responses: `200 OK` (empty array if none), `404` if borrower not found (optional)

- **Overdue books**  
  `GET /borrowings/overdue`  
  Behavior:
  - dueDate < today AND status = "borrowed"
  - Includes book and borrower  
    Response: `200 OK` (empty array if none)

---

## 6) Error Handling & Status Codes

- `400 Bad Request` — invalid input (e.g., borrow when qty=0)
- `404 Not Found` — resource doesn’t exist
- `409 Conflict` — unique constraint violations (e.g., duplicate email/isbn)
- `500 Internal Server Error` — unexpected exceptions

Each controller wraps logic in try/catch and returns a JSON error:

```json
{ "error": "Readable error message here" }
```

---

## 7) Performance Notes

- Search uses case-insensitive matching (ILIKE) on title, author, isbn
- Indexes recommended on Books(title), Books(author) to accelerate searches
- Unique constraints on isbn and email prevent duplicates
