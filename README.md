# Node.js Backend API – Clean Architecture with JWT Authentication

## Overview

This is a backend RESTful API built with **Node.js**, designed using a clean and modular architecture to ensure scalability and maintainability. The project includes **JWT-based authentication** and sample implementations for user and company CRUD operations.

## Features

- Clean project structure (service, controller, entity/module separation)
- JWT Authentication for secure access
- Modular and scalable architecture
- Example API endpoints for managing users and companies
- Middleware-based request handling
- Ready to be consumed by frontend or mobile applications

## Tech Stack

- Node.js
- Express.js or NestJS
- JWT (JSON Web Tokens)
- PostgreSQL or MongoDB
- Sequelize / Prisma / TypeORM
- dotenv for environment variable management

## API Endpoints

All Endpoint using '*api/v1*'

### Auth

| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| POST   | api/v1/auth/login   | User login and token generation |

### Users

| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| GET    | /users        | Get all users            |
| POST   | /users        | Create a new user        |
| GET    | /users/:id    | Get user by ID           |
| PUT    | /users/:id    | Update user              |
| DELETE | /users/:id    | Delete user              |

### Companies

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /companies       | Get all companies        |
| POST   | /companies       | Create a new company     |
| GET    | /companies/:id   | Get company by ID        |
| PUT    | /companies/:id   | Update company           |
| DELETE | /companies/:id   | Delete company           |

## Authentication

This project uses **JWT (JSON Web Tokens)** for protecting private routes. After logging in, include the token in your request header:

