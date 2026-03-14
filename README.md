# Construction Material E‑Commerce Platform (MERN)

Professional MERN stack app with a modern, Figma-style wireframe UI.

## Tech

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose

## Folder structure

```
construction material/
  backend/
    src/
      controllers/
      middleware/
      models/
      routes/
      seed/
      utils/
  frontend/
    src/
      components/
      pages/
      state/
      utils/
```

## Features

- **Auth**: Register, Login, JWT, protected routes, admin role
- **Products**: categories, listing with filters, product details, admin CRUD
- **Search**: global navbar search + backend search API (`/api/products?q=...`)
- **Cart**: add/remove/update qty, totals (stored in `localStorage`)
- **Orders**: checkout with delivery address, place order, order history
- **Admin dashboard**: manage products, view orders, view users, update order status

## Prerequisites

- Node.js (installed)
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup (Backend)

From the project root:

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and set:

- `MONGO_URI`
- `JWT_SECRET`

Install and seed:

```bash
npm install
npm run seed
```

Run the API:

```bash
npm run dev
```

API health check: `http://localhost:5000/api/health`

## Setup (Frontend)

From the project root:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Demo accounts (after seeding)

- **Admin**: `admin@buildmart.com` / `Admin123!`
- **User**: `user@buildmart.com` / `User123!`

## Notes

- Product search + filters use `GET /api/products` with query params: `q`, `category`, `minPrice`, `maxPrice`, `rating`, `sort`, `page`, `limit`.
- Checkout posts orders to `POST /api/orders` and computes totals server-side.

