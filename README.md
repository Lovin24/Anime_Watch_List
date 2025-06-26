# AnimeWatchList

AnimeWatchList is a modern, minimalist platform to track, discover, and manage your anime journey. Built for otaku and anime fans who want a beautiful, easy-to-use watchlist and recommendation experience.

## Features

- Add, edit, and manage your personal anime watchlist
- AI-powered recommendations based on your taste
- Clean, otaku-inspired user interface
- Responsive design for all devices
- Social and contact links in the footer

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Setup

1. Clone this repository
2. Install dependencies in both `frontend` and `backend` folders:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Create a `.env` file in the `backend` directory with your MongoDB URI, JWT secret, and Gemini API key:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=8080
   ```
4. Start the backend:
   ```bash
   npm start
   ```
5. Start the frontend:
   ```bash
   npm run dev
   ```
6. Open your browser at `http://localhost:5173`

## Folder Structure

- `frontend/` - React app (UI)
- `backend/` - Node.js/Express API
