# DriveDealer Car Dealership Inventory System

DriveDealer is a full-stack web application designed for managing car dealership inventory, user authentication, and purchasing transactions. It provides a role-based environment where customers can view, search, and purchase vehicles, while administrators can perform CRUD operations on vehicles, restock items, and track live stock metrics.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Test Accounts](#test-accounts)
- [Testing and Coverage](#testing-and-coverage)
- [Screenshots](#screenshots)
- [Design Decisions](#design-decisions)
- [My AI Usage](#my-ai-usage)
- [License](#license)

---

## Features

- **Role-Based Access Control (RBAC)**
  - Separate login views and dashboard controls for Admin and Customer accounts.
  - JWT token-based authentication with automatic header injection via Axios.

- **Inventory Management**
  - Admins can restock vehicle quantities, and track low-stock (1-4 units) and out-of-stock items.
  - Customers can purchase vehicles, which automatically decrements the stock quantity.

- **Vehicle Management (CRUD)**
  - Admins can add, update, and delete vehicle entries, including a local image upload.

- **Live Search and Filters**
  - Filtering by vehicle make, model, category (Sedan, SUV, Coupe, etc.), and price range.

- **Interactive Showroom Interface**
  - Zoomable image previews (lightbox modal) for closer inspection of vehicle details.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account (always CUSTOMER role)
- `POST /api/auth/login` - Authenticate credentials and receive JWT
- `GET /api/auth/me` - Return the currently authenticated user

### Vehicle Management (Protected)
- `POST /api/vehicles` - Add a new vehicle (Admin only)
- `GET /api/vehicles` - Retrieve all vehicles
- `GET /api/vehicles/search` - Search vehicles with query parameters
- `POST /api/vehicles/upload` - Upload a vehicle image to local disk storage (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle specifications (Admin only)
- `DELETE /api/vehicles/:id` - Delete a vehicle record (Admin only)

### Inventory Operations (Protected)
- `POST /api/vehicles/:id/purchase` - Purchase a vehicle (decrease stock by 1)
- `POST /api/vehicles/:id/restock` - Restock vehicle quantity (Admin only)

---

## Data Model

Each vehicle contains the following fields:
- **ID**: Unique string identifier
- **Make**: Brand name of the vehicle
- **Model**: Model name of the vehicle
- **Category**: Vehicle type enum (SEDAN, SUV, TRUCK, COUPE, HATCHBACK, CONVERTIBLE, VAN, MOTORCYCLE)
- **Price**: Decimal numeric value (INR)
- **Quantity**: Integer count of units in stock
- **Description**: Optional text details
- **ImageUrl**: Path/URL to the vehicle photo

---

## Tech Stack

### Frontend:
- React.js with functional components
- React Router DOM for route redirection and protected layouts
- Axios for API communication and JWT request interceptors
- Tailwind CSS for layout and the custom design token system
- React Hook Form and Zod for schema validation
- Vitest and Testing Library for unit testing

### Backend:
- Node.js and Express with TypeScript
- Prisma ORM for database mapping and migrations
- PostgreSQL for relational storage
- JSON Web Token (JWT) for secure authentication
- Multer for local vehicle image uploads
- Jest and Supertest for TDD-driven unit and integration testing

---

## Project Structure

```text
car_dealership_inventory/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── lib/
│   │   │   ├── jwt.ts
│   │   │   └── prisma.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.dto.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── inventory/
│   │   │   │   └── inventory.service.ts
│   │   │   └── vehicles/
│   │   │       ├── vehicles.controller.ts
│   │   │       ├── vehicles.dto.ts
│   │   │       ├── vehicles.routes.ts
│   │   │       └── vehicles.service.ts
│   │   ├── utils/
│   │   │   └── ApiError.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/
│       ├── integration/
│       │   ├── auth.controller.test.ts
│       │   └── vehicles.controller.test.ts
│       ├── unit/
│       │   ├── auth.middleware.test.ts
│       │   ├── auth.service.test.ts
│       │   ├── inventory.service.test.ts
│       │   ├── role.middleware.test.ts
│       │   └── vehicles.service.test.ts
│       └── setup.ts
│
├── frontend/
│   ├── public/
│   │   └── uploads/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.tsx
│   │   │   ├── shared/
│   │   │   │   └── Badge.tsx
│   │   │   └── vehicles/
│   │   │       ├── VehicleCard.tsx
│   │   │       ├── VehicleForm.tsx
│   │   │       └── VehicleTable.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── ManageVehicles.tsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── utils/
│   │   │   ├── stockStatus.ts
│   │   │   └── vehicleImage.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── tests/
│   │   └── unit/
│   │       ├── Badge.test.tsx
│   │       ├── VehicleCard.test.tsx
│   │       ├── VehicleTable.test.tsx
│   │       ├── stockStatus.test.ts
│   │       └── vehicleImage.test.ts
│   ├── index.html
│   └── vite.config.ts
│
├── docs/
│   └── screenshots/
│
├── architecture.md
├── design.md
├── tasks.md
├── PROMPTS.md
└── README.md
```

---

## Getting Started

### Development Workflow
Following industry-standard practices, this project was developed using a structured, step-by-step pipeline:
1. **Architecture Planning**: First established the system architecture, directory structures, and file separations.
2. **Database Schema Design**: Designed the database schema and model relationships using Prisma ORM.
3. **Design System & Theme Selection**: Configured the color tokens and component styling with a professional, off-white palette to deliver a high-quality showroom presentation.
### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment file (`.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/dealership"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="1d"
   PORT=5000
   CORS_ORIGIN="http://localhost:5173"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Seed the database with an admin account, a customer account, and 20 sample vehicles:
   ```bash
   npx prisma db seed
   ```
6. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment file (`.env`):
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

### Test Accounts

These are created automatically by the seed script in step 5 above:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@dealership.com` | `admin123` |
| Customer | `customer@dealership.com` | `customer123` |

> The screenshots below also show a self-registered customer account
> (`raj123@gmail.com`) created through the Sign Up flow, to demonstrate
> registration working end to end — that account only exists after you
> register it yourself, it is not part of the seed data.

---

## Testing and Coverage

### Backend Tests

Backend tests are implemented with Jest and Supertest, following test-driven
development (red, green, refactor) — see `tasks.md` for the phase-by-phase
breakdown of how each feature was built test-first.

```bash
cd backend
npm test
```

To generate a coverage report (run sequentially to avoid test-database
thread conflicts):
```bash
npx jest --coverage --runInBand
```

**Coverage Output:**
```text
 PASS  tests/integration/auth.controller.test.ts
 PASS  tests/integration/vehicles.controller.test.ts
 PASS  tests/unit/auth.service.test.ts
 PASS  tests/unit/inventory.service.test.ts
 PASS  tests/unit/vehicles.service.test.ts
 PASS  tests/unit/auth.middleware.test.ts
 PASS  tests/unit/role.middleware.test.ts
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |    95.5 |    85.36 |   97.22 |   95.48 |
 src              |   92.85 |      100 |       0 |   92.85 |
  app.ts          |   92.85 |      100 |       0 |   92.85 | 19
 src/lib          |     100 |       50 |     100 |     100 |
  jwt.ts          |     100 |       50 |     100 |     100 | 3-4
  prisma.ts       |     100 |      100 |     100 |     100 |
 src/middleware   |   90.47 |    83.33 |     100 |   90.24 |
  ...iddleware.ts |     100 |      100 |     100 |     100 |
  ...iddleware.ts |   71.42 |       50 |     100 |   71.42 | 19-21
  ...iddleware.ts |    90.9 |      100 |     100 |    90.9 | 24
  ...iddleware.ts |   91.66 |       50 |     100 |    90.9 | 21
 src/modules/auth |   95.23 |       75 |     100 |   95.23 |
  ...ontroller.ts |   88.46 |       50 |     100 |   88.46 | 43,51,62
  auth.dto.ts     |     100 |      100 |     100 |     100 |
  auth.routes.ts  |     100 |      100 |     100 |     100 |
  auth.service.ts |     100 |      100 |     100 |     100 |
 ...les/inventory |     100 |      100 |     100 |     100 |
  ...y.service.ts |     100 |      100 |     100 |     100 |
 ...ules/vehicles |   96.26 |    89.13 |     100 |   96.26 |
  ...ontroller.ts |   93.84 |     92.3 |     100 |   93.84 | 17,30,63,101
  vehicles.dto.ts |     100 |      100 |     100 |     100 |
  ...es.routes.ts |   96.42 |       50 |     100 |   96.42 | 15
  ...s.service.ts |     100 |    88.88 |     100 |     100 | 70-73
 src/utils        |     100 |      100 |     100 |     100 |
  ApiError.ts     |     100 |      100 |     100 |     100 |
------------------|---------|----------|---------|---------|-------------------
Test Suites: 7 passed, 7 total
Tests:       72 passed, 72 total
```

The remaining uncovered lines are mostly generic error-handling fallback
branches (e.g. the catch-all 500 case in `error.middleware.ts`) and
Express route/wiring boilerplate in `app.ts`, which don't have meaningful
business logic to unit test on their own.

### Frontend Tests

Frontend tests are written with Vitest and Testing Library, covering the
core display logic (stock-status badges, image fallback, and the vehicle
card/table components).

```bash
cd frontend
npm run test
```

To generate a coverage report:
```bash
npx vitest run --coverage
```

**Coverage Output:**
```text
 ✓ src/utils/stockStatus.test.ts (5 tests)
 ✓ src/utils/vehicleImage.test.ts (3 tests)
 ✓ src/components/shared/Badge.test.tsx (5 tests)
 ✓ src/components/vehicles/VehicleCard.test.tsx (8 tests)
 ✓ src/components/vehicles/VehicleTable.test.tsx (3 tests)

 Test Files  5 passed (5)
      Tests  24 passed (24)

------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   93.33 |    90.58 |      88 |   93.22 |
 ...onents/shared |     100 |      100 |     100 |     100 |
  Badge.tsx       |     100 |      100 |     100 |     100 |
 ...ents/vehicles |      90 |    88.05 |   85.71 |   89.74 |
  VehicleCard.tsx |   85.18 |    92.85 |   78.57 |   84.61 | 38-39,77,184
  ...cleTable.tsx |     100 |       80 |     100 |     100 | 109,146-153
 utils            |     100 |      100 |     100 |     100 |
  stockStatus.ts  |     100 |      100 |     100 |     100 |
  vehicleImage.ts |     100 |      100 |     100 |     100 |
------------------|---------|----------|---------|---------|-------------------
```

---

## Screenshots

### Authentication
| User Login | User Registration |
|:---:|:---:|
| ![User Login](docs/screenshots/login.png) | ![User Registration](docs/screenshots/signup.png) |

### Storefront & Details
| Customer Dashboard Grid | Search & Filter Results |
|:---:|:---:|
| ![Dashboard Grid](docs/screenshots/dashboard-grid.png) | ![Search and Filter](docs/screenshots/dashboard-search-filter.png) |

| Out of Stock Behavior | Lightbox Preview |
|:---:|:---:|
| ![Out of Stock](docs/screenshots/dashboard-out-of-stock.png) | ![Image Zoom](docs/screenshots/vehicle-image-preview.png) |

### Admin Inventory Operations
| Admin Dashboard & KPIs | Add Vehicle Modal |
|:---:|:---:|
| ![Manage Inventory](docs/screenshots/admin-manage-vehicles.png) | ![Add Vehicle](docs/screenshots/admin-add-vehicle.png) |

| Edit Vehicle Details | Restock Inventory Modal |
|:---:|:---:|
| ![Edit Vehicle](docs/screenshots/admin-edit-vehicle.png) | ![Restock Inventory](docs/screenshots/admin-restock.png) |

---

## Design Decisions

A few choices worth explaining, since they were deliberate rather than
default:

- **Feature-module backend structure, tests kept separate.** Code is
  grouped by feature (`modules/auth`, `modules/vehicles`,
  `modules/inventory`) so everything about one feature lives in one place,
  but all tests live under a top-level `tests/` folder (`unit/` and
  `integration/`) instead of next to the source — keeps `src/` as pure
  application code and makes test coverage easy to eyeball at a glance.

- **The customer-facing Dashboard uses cards; the Admin inventory view
  stays a table.** Customers browse a storefront, admins manage a
  dashboard and need to scan/act on many rows at once — a dense table
  serves that better than cards.


---

## My AI Usage

### Tools Utilized
- **Gemini (Google)**
- **Claude (Anthropic)**
- **GitHub Copilot**

### How These Tools Were Integrated Into My Workflow

#### Gemini
Gemini acted as a core development partner for backend test suites and business logic iterations, and for defining service routes. In the final phase, it was used to resolve Zod schema parameters and type definitions when integrating React Hook Form.

#### Claude
Used to generate the whole architecture, design, and task breakdown for the project. It assisted creating and managing database queries via Prisma, frontend visual prototyping, and middleware design. It was used to bootstrap React component layouts, establish routing guards for role authorization, configure Multer disk storage properties, and point out gaps in Jest coverage.

#### GitHub Copilot
GitHub Copilot assisted during the implementation of standard frontend components. It provided autocompletion suggestions for form controllers, input layouts, and validation handlers, accelerating repetitive tasks.


### ChatGPT
Helped me writing prompts and commit messages
---

## License

This project is licensed under the MIT License.