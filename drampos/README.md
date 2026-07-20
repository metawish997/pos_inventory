# DreamPOS Frontend

This directory contains the React frontend for DreamPOS.

## Structure

- **src/App.jsx**: Main application routing. Implements public routes (`/signin`) and protected routes via `<ProtectedRoute>`.
- **src/components/**: Reusable UI components.
  - `ProtectedRoute.jsx`: Frontend middleware checking for JWT token in `localStorage`.
- **src/pages/**: Page-level components matching the routes.
  - `SignIn.jsx`: Dynamic component handling both Login and Registration with API integration to backend `/api/auth`.
- **src/assets/**: Static assets.

## State & Authentication
Authentication token and user object are stored in `localStorage` (`token`, `user`).
Protected routes verify this state and redirect to `/signin` if missing.
