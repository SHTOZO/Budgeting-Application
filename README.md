# Budgeting Application

A personal budgeting web application for tracking budgets, categories, and expenses with real-time totals.

## Overview

This application allows users to:

- Create and manage budgets
- Organize spending with categories
- Add and delete expenses
- View remaining budget values
- Review category-based spending
- Toggle spending chart visualization

## Core Features

- User authentication with JWT
- Budget CRUD operations
- Category management (create, edit, delete)
- Expense tracking per category
- Automatic category spend aggregation
- Inline delete confirmations in UI
- Currency formatting in HUF

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT

## Architecture

- Monorepo structure:
  - `client/` for frontend
  - `server/` for backend API
- REST API for auth, budgets, categories, expenses
- MongoDB models with indexed relations

## Security

- Password hashing
- JWT-based protected routes
- Rate limiting
- Helmet hardening
- CORS origin restrictions

## Deployment

- Hosted on Render (single web service)
- MongoDB Atlas for persistent cloud database
