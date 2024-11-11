# Stack RUET - Forum Website Backend

This repository contains the backend for a university forum website, where students can engage in discussions, share posts, and more. Built with **Node.js**, **Express**, and **MongoDB**.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [API Endpoints](#api-endpoints)
  - [Authentication & Authorization](#authentication--authorization)
  - [Users](#users)
  - [Forums](#forums) (Not yet implemented)
  - [Posts](#posts) (Not yet implemented)
  - [Comments](#comments) (Not yet implemented)
  - [User Profiles](#user-profiles) (Not yet implemented)
  - [Moderation](#moderation) (Not yet implemented)

## Features

- User authentication and authorization using JWT.
- Full CRUD functionality for managing forums, posts, and comments.
- User profiles with the ability to update profile information and view activities.
- Like and bookmark posts.
- Moderation capabilities for forum management.

## Technologies Used

- **Node.js** and **Express.js** for server-side development.
- **MongoDB** with **Mongoose** for database management.
- **JWT** for user authentication.
- **bcrypt** for password hashing.
- **express-validator** for request validation.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v12+)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

## API Endpoints

### Authentication & Authorization

| Method | Endpoint                      | Description           | Request Body                |
| ------ | ----------------------------- | --------------------- | --------------------------- |
| POST   | `/api/users/process-register` | Register a new user   | `name`, `email`, `password` |
| POST   | `/api/users/verify`           | Activate user account | `token`                     |

### Users

| Method | Endpoint         | Description         | Request Body |
| ------ | ---------------- | ------------------- | ------------ |
| GET    | `/api/users`     | Get all users       | N/A          |
| GET    | `/api/users/:id` | Get a user by ID    | N/A          |
| DELETE | `/api/users/:id` | Delete a user by ID | N/A          |

### Posts

| Method | Endpoint         | Description         | Request Body                     |
| ------ | ---------------- | ------------------- | -------------------------------- |
| GET    | `/api/posts`     | Get all posts       | N/A                              |
| GET    | `/api/posts/:id` | Get a post by ID    | N/A                              |
| PUT    | `/api/posts/:id` | Update a post by ID | `title`, `content`, `tags`, etc. |
