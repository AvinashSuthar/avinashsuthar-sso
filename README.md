# SSO Authentication Service

This application is built to provide Single Sign-On (SSO) authentication for your website. It uses Node.js, TypeScript, Express, Mongoose, and MongoDB to manage user authentication securely and efficiently.

## Features

- Single Sign-On (SSO) authentication for your website
- Secure user management with MongoDB
- Built with TypeScript for type safety

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Create a `.env` file with your MongoDB URI and desired port:
     ```env
     MONGO_URI=mongodb://localhost:27017/sso-auth
     PORT=3000
     ```
3. **Set up MongoDB:**
   - Make sure MongoDB is running locally, or set the `MONGO_URI` environment variable to your MongoDB connection string.
4. **Run in development mode:**
   ```bash
   npm run dev
   ```
5. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

Endpoints will be provided for SSO authentication, user registration, login, and session management. Please refer to the code for current routes and update as needed for your website's requirements.

## Project Structure

```
src/
   index.ts         # Entry point
   models/Note.ts   # Mongoose User/Note model
   routes/notes.ts  # API routes
   lib/connectDb.ts # Database connection logic
```
