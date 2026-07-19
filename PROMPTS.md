### Architecture
Claude
You're a Senior experienced system design engineer
I want you8 to write 3 files architecture.md, design.md and tasks.md - the tasks.md 
must be divided into phases and each pahse is further didvided into tasks, divide 
tasks in meta-division wise following Test-Driven Development (TDD). 
Each phase should contain clear, incremental tasks.
make all 3 files very comprehensive 
tech stack - we use nodejs,express typescript for backend
frontend - HTML5, CSS3, Tailwind, and React 
db - postgres (pgadmin) via prisma
proper rbac control and protected routes
main focus -> clean and understandable code by me , core functioanlity properly works , tdd and tests cases for everything in tasks.md file, fornow we will keep the design minimal and all and after evveythings' done we will be creative and change some frontend design part

### Database Schema
Claude

Generate a production-ready Prisma schema for the Car Dealership Inventory System.

Requirements:
- Use PostgreSQL as the datasource.
- Create appropriate enums for user roles, vehicle categories, and inventory transaction types.
- Define models for User, Vehicle, and InventoryTransaction.
- Use proper one-to-many relationships with referential integrity.
- Add appropriate indexes and constraints where necessary.
- Use Prisma best practices for IDs, timestamps, defaults, and updatedAt fields.
- Ensure the schema supports authentication, vehicle management, purchasing, and restocking.
- Include comments where helpful to explain important design decisions.
- The schema should be clean, normalized, scalable, and follow industry best practices.


### TDD
Gemini
Write test cases for user registration following  Red - green - refactor cycle

Gemini
-Implemnt refactoring the cases and complete registration endpoint

Gemini
Write test cases for user login following same  Red - green - refactor cycle

Gemini
-Implemnt refactoring the cases and complete login endpoint with necessary dtos and service business logic

Gemini
-Similar to previous failed test cases now give m efor authentication for integration test

Gemini
-Now giev me code for auth.service, auth.controller and auth.route to refactor and pass all these test cases

## Role Authorization Middleware


Gemini
Write unit tests for the role-based authorization middleware following the TDD Red → Green → Refactor cycle.

Gemini
Write failing test cases for the create vehicle service following the TDD Red phase.

## Fix
Claude
Refactor the project configuration to resolve ts-node-dev type compilation issues and fix mockReq typing while ensuring all existing tests continue to pass.


## Backend TDD
Gemini
Write failing unit tests for the update vehicle service following the TDD Red → Green → Refactor cycle.
Implement the vehicle update feature to satisfy all failing unit tests, create the update endpoint, add integration tests, and ensure all tests pass successfully.

## Inventory
Write failing unit tests for the vehicle stock service following the TDD Red → Green → Refactor cycle.
Implement the vehicle stock management feature to satisfy all failing unit tests, add integration tests for stock operations, and ensure all tests pass successfully.

# Frontend
Claude
You're a Senior experienced web designer. I want your expertise in creating a Professional frontend for my system.
I have setup Backend and database as required

### Axios Instance & Interceptors
Claude
we need to config axios with base url and make sure it passes the jwt token in headers automatically for every req. can you write an interceptor for that

### Client-side Route Protection (Protected Routes)
Claude
how do we protect routes so only logged in users can see dashboard? also only admins should go to manage vehicles page, redriect them if they try to access

### User Registration Page
Claude
create a register page where users can sign up. make sure to validate full name, email, password length, and that confirm password matches password using zod

### User Login & Authentication Session
Github Copilot
build a login page that takes email and password, calls login api, stores token in auth context, and routes user to dashboard on success

## Feature Requests & Enhancements

### Replacing Table with Card Grid
Claude
hey can we change the vehicle list to a card grid instead of the boring table. make it look premium and responsiv so it works on mobile too

### Compact Admin Inventory Actions
Claude
i want only icons and not button for edit and delete on the manage inventory page. keep restock as is. also remove the borders and backgrounds form the edit and delete buttons, just icon is enough

### Search & Filters on Admin Dashboard
Gemini
for admin page on manage inventory page also include the serachcomponent with filters and all so i can find cars easily

### Live Image Preview & Shape Adjustments
Claude
can we show a live image preview thumbnail in the car form? also stretch the image preview container a littlr bit horizaontally and vertically to look like a landscape
when I click on a car image on the card can it open a zoomed preview? make it look like a lightbox modal with a blur background that closes on click or esc key

### Seeding matched dataset
Gemini
just go to the uploads folder and see i only have 12 photos and match those naems with the seed.ts data and remove extra thing and again run it

---

## Design Tweaks

### Experimenting with Warm Theme
Gemini
can we do anyting about the background color of our app? apply some warm background that suits our problem statement like a car showroom

### Reverting and Adjusting
Gemini
can you revert back to the background and all theme to what it was

### Professional Off-White Modern Style
Gemini
can you change th ewhole oclor theme and make it professioanl off white evyehitng

---

## Bug Fixes

### Resolving Zod Enum Parameter Type Mismatch
Gemini
im getting this typescript error 'No overload matches this call' in VehicleForm.tsx on z.enum category because required_error doesn't exist. help me fix it

### Fixing useForm and zodResolver Type Incompatibilities
Gemini
explain what this error is and help me fix it: Type 'Resolver<{ price: unknown... }>' is not assignable to 'Resolver<{ price: number... }>'. it says type 'unknown' is not assignable to type 'number' in useForm resolver call in VehicleForm.tsx
