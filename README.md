# TypeScript Note App

A simple note-taking REST API built with Node.js, TypeScript, Express, Mongoose, and MongoDB.

## Features

- Create, read, update, and delete notes
- TypeScript for type safety
- MongoDB for data storage

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up MongoDB:**

   - Make sure MongoDB is running locally, or set the `MONGO_URI` environment variable to your MongoDB connection string.

3. **Run in development mode:**

   ```bash
   npm run dev
   ```

4. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get a single note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Project Structure

```
src/
  index.ts         # Entry point
  models/Note.ts   # Mongoose Note model
  routes/notes.ts  # Notes API routes
```
