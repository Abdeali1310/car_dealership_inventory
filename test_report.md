# DriveDealer Test Suite & Coverage Report

This document serves as the comprehensive testing and code coverage report for both the backend (Node.js/Express/Prisma) and frontend (React/Vite/Vitest) applications of the DriveDealer Car Dealership Inventory System.

---

## 1. Backend Testing (Jest & Supertest)

The backend test suite is composed of unit tests for services/middlewares and integration tests for route controllers. The integration tests interact directly with a test PostgreSQL database via Prisma, managed sequentially to prevent race conditions and transaction blockages.

### 1.1 Backend Test Execution Command

To run all backend tests sequentially and generate the full coverage report:
```bash
cd backend
npx jest --coverage --runInBand
```

### 1.2 Summary Coverage Output (text-summary)

Command used to output the summary:
```bash
npx jest --coverage --runInBand --coverageReporters=text-summary
```

**Output:**
```text
PASS tests/integration/auth.controller.test.ts (6.986 s)
PASS tests/integration/vehicles.controller.test.ts
PASS tests/unit/auth.service.test.ts
PASS tests/unit/inventory.service.test.ts
PASS tests/unit/role.middleware.test.ts
PASS tests/unit/auth.middleware.test.ts
PASS tests/unit/vehicles.service.test.ts

=============================== Coverage summary ===============================
Statements   : 95.53% ( 278/291 )
Branches     : 85.36% ( 70/82 )
Functions    : 97.22% ( 35/36 )
Lines        : 95.51% ( 277/290 )
================================================================================
```

### 1.3 Full File-by-File Coverage Metrics 

**Output:**
```text
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   95.53 |    85.36 |   97.22 |   95.51 |
 src              |   92.85 |      100 |       0 |   92.85 |
  app.ts          |   92.85 |      100 |       0 |   92.85 | 19
 src/lib          |     100 |       50 |     100 |     100 |
  jwt.ts          |     100 |       50 |     100 |     100 | 3-4
  prisma.ts       |     100 |      100 |     100 |     100 |
 src/middleware   |   90.47 |    83.33 |     100 |   90.24 |
  auth.middleware.ts     |     100 |      100 |     100 |     100 |
  error.middleware.ts    |   71.42 |       50 |     100 |   71.42 | 19-21
  role.middleware.ts     |    90.9 |      100 |     100 |    90.9 | 24
  validate.middleware.ts |   91.66 |       50 |     100 |    90.9 | 21
 src/modules/auth |   95.23 |       75 |     100 |   95.23 |
  auth.controller.ts     |   88.46 |       50 |     100 |   88.46 | 43,51,62
  auth.dto.ts      |     100 |      100 |     100 |     100 |
  auth.routes.ts   |     100 |      100 |     100 |     100 |
  auth.service.ts  |     100 |      100 |     100 |     100 |
 src/modules/inventory   |     100 |      100 |     100 |     100 |
  inventory.service.ts   |     100 |      100 |     100 |     100 |
 src/modules/vehicles    |   96.26 |    89.13 |     100 |   96.26 |
  vehicles.controller.ts |   93.84 |     92.3 |     100 |   93.84 | 17,30,63,101
  vehicles.dto.ts  |     100 |      100 |     100 |     100 |
  vehicles.routes.ts     |   96.42 |       50 |     100 |   96.42 | 15
  vehicles.service.ts    |     100 |    88.88 |     100 |     100 | 70-73
 src/utils        |     100 |      100 |     100 |     100 |
  ApiError.ts     |     100 |      100 |     100 |     100 |
------------------|---------|----------|---------|---------|-------------------
```

---

## 2. Frontend Testing (Vitest & Testing Library)

The frontend test suite covers core component UI behaviors, form inputs, stock state computations, dynamic badges, image visual resolution helpers, and layout tables.

### 2.1 Frontend Test Execution Command

To run all frontend tests:
```bash
cd frontend
npx vitest run --coverage
```

### 2.2 Summary Coverage Output (text-summary)

Command used to output the summary:
```bash
npx vitest run --coverage --coverage.reporter=text-summary --sequence.concurrent=false
```

**Output:**
```text
 

 ✓ src/utils/stockStatus.test.ts (5 tests) 5ms
 ✓ src/utils/vehicleImage.test.ts (3 tests) 5ms
 ✓ src/components/shared/Badge.test.tsx (5 tests) 49ms
 ✓ src/components/vehicles/VehicleTable.test.tsx (3 tests) 320ms
 ✓ src/components/vehicles/VehicleCard.test.tsx (8 tests) 338ms

 Test Files  5 passed (5)
      Tests  24 passed (24)
   Start at  20:13:56
   Duration  4.81s (transform 529ms, setup 1.87s, import 1.69s, tests 717ms, environment 15.32s)

=============================== Coverage summary ===============================
Statements   : 90.62% ( 58/64 )
Branches     : 86.81% ( 79/91 )
Functions    : 88% ( 22/25 )
Lines        : 90.47% ( 57/63 )
================================================================================
```

### 2.3 Full File-by-File Coverage Metrics 

**Output:**
```text
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------|---------|----------|---------|---------|-------------------
All files         |   90.62 |    86.81 |      88 |   90.47 |                   
 ...onents/shared |     100 |      100 |     100 |     100 |                   
  Badge.tsx       |     100 |      100 |     100 |     100 |                   
 ...ents/vehicles |   86.53 |     83.9 |   85.71 |   86.27 |                   
  VehicleCard.tsx |   81.48 |    89.28 |   78.57 |   80.76 | 38-39,77,184      
  ...cleTable.tsx |     100 |       80 |     100 |     100 | 109,146-153       
 utils            |   91.66 |    85.71 |     100 |   91.66 |                   
  stockStatus.ts  |     100 |      100 |     100 |     100 |                   
  vehicleImage.ts |   85.71 |       75 |     100 |   85.71 | 21-22             
------------------|---------|----------|---------|---------|-------------------
```

---

