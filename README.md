# ShopVerse - Mini E-Commerce Platform

ShopVerse is a modern, responsive, and high-fidelity **Mini E-Commerce Website** built with a **Node/Express.js backend** and a **React (Vite) frontend**. 

It features a custom-designed Obsidian Dark Theme styled entirely with vanilla CSS (incorporating glassmorphism overlays, glowing borders, and smooth transitions) alongside a built-in Light Mode.

---

## 🌟 Key Features

*   **Product Catalog**: Browse products with search functionality and category filtering (e.g., Electronics, Apparel, Accessories).
*   **Detailed Product Page**: View specs, reviews, stock availability, and high-quality product images.
*   **Slide-out Cart Drawer**: Seamlessly add products to the cart, adjust quantities, and watch totals recalculate in real-time.
*   **User Authentication**: JWT-based secure user registration and login forms with toast alert notifications.
*   **Dual-Mode Database Layer**:
    *   **MongoDB Mode**: Connects automatically to local/remote MongoDB databases.
    *   **Local File Fallback Mode**: If MongoDB is offline, the backend dynamically falls back to a local JSON-based file store (`backend/data/db.json`) pre-populated with seed data, ensuring the app remains fully functional (including registration, logins, and order histories) without external dependencies.
*   **Interactive Checkout**: Shipping information form with validation, order summary checkout, and real-time order placements.
*   **User Profile / Dashboard**: Tracks past order history, order status updates, and total checkout amounts.

---

## 🛠️ Technology Stack

### Backend
*   **Node.js** & **Express.js** (REST API)
*   **MongoDB** (via **Mongoose**)
*   **JSON-file fallback system** (for offline local storage)
*   **JSON Web Tokens (JWT)** & **BcryptJS** (Authentication)
*   **Cors** & **Dotenv**

### Frontend
*   **React** (via **Vite**)
*   **React Router Dom** (Single-page app routing)
*   **Vanilla CSS** (Obsidian Glassmorphism & Custom Light Theme toggles)
*   **Context API** (State management for Auth, Cart, Theme, and Toasts)

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   *Optional:* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (If not running, the application will automatically fall back to the local database file `backend/data/db.json`).

### Installation
From the root directory, run the helper command to install dependencies for the root, backend, and frontend directories all at once:
```bash
npm run install-all
```

### Environment Configuration
1. Navigate to the `backend` directory.
2. Edit or create a `.env` file containing the environment variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
```

### Running Locally
To launch both the frontend and backend servers concurrently, run the following command in the root folder:
```bash
npm run dev
```
*   **Frontend Development Server**: `http://localhost:5173`
*   **Backend API Server**: `http://localhost:5000`

---

## 📁 Project Structure

```text
├── backend/
│   ├── config/          # Database configuration and connector
│   ├── data/            # Local JSON database and seed products
│   ├── middleware/      # Auth and validation middlewares
│   ├── models/          # Mongoose schemas & Fallback model wrappers
│   ├── routes/          # Express API route endpoints
│   ├── server.js        # Main Express server entrypoint
│   └── .env             # Backend environment settings
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable elements (Navbar, CartDrawer, etc.)
│   │   ├── context/     # Auth, Cart, Theme, and Toast React Contexts
│   │   ├── pages/       # Product catalog, Details, Checkout, Profile
│   │   ├── index.css    # Obsidian Glassmorphic & Light Mode CSS styling
│   │   ├── main.jsx     # Frontend entrypoint
│   │   └── App.jsx      # Navigation routing setup
```

---

## 🎨 Theme Toggle
The application includes a header navbar toggle button to switch between:
1.  **Obsidian Theme (Dark)**: Sleek purple borders, glassmorphic dark container backdrops, and white/gray high-contrast text.
2.  **Ice Theme (Light)**: Clean pastel blue `#B6D9E0` background with customized contrasting typography.
