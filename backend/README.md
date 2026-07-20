# DreamPOS Backend

This directory contains the Node.js / Express backend for DreamPOS.

## Structure

- **server.js**: Entry point. Connects to MongoDB, invokes the `rbacSeeder`, and mounts routes.
- **models/**: Mongoose schemas.
  - `User.js`: User model with password hashing via `bcryptjs`. Has `role` reference.
  - `Role.js`: Role model referencing `Permission`.
  - `Permission.js`: Permission model for RBAC (e.g., `read_sales`).
- **routes/**: API endpoints.
  - `authRoutes.js`: `/api/auth/register` (auto-assigns 'user' role) and `/api/auth/login`.
- **middleware/**: Custom middlewares.
  - `authMiddleware.js`: `protect` (verifies JWT token) and `authorize` (checks RBAC permissions, super_admin overrides).
- **seeder/**: Database seeders.
  - `rbacSeeder.js`: Auto-generates CRUD permissions and ensures `super_admin` and `user` roles exist on startup.

## Authentication & RBAC
- JWT tokens are issued on login/register.
- Passwords are encrypted automatically using a pre-save hook on the User model.
- Roles and permissions are automatically seeded when `server.js` starts.
