# GasFlow Backend

This is the backend for the GasFlow Delivery project, built with Node.js, Express, and Prisma.

## Setup

1.  Navigate to the `backend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  The environment variables are already configured in `.env` (using Prisma Accelerate).

## Database Schema

The database is managed by Prisma and includes the following models:

- **User**: Admins, Managers, and Delivery Staff.
- **Order**: Assignments for cylinder deliveries.
- **Transaction**: Payment records (Cash/UPI).
- **Inventory**: Stock management for different cylinder types.

## Commands

- **Start Server**: `npm start`
- **Development Mode**: `npm run dev`
- **Update Database Schema**:
  1. Modify `prisma/schema.prisma`.
  2. Run `npx prisma db push` to sync changes to the database.
- **Generate Client**: `npx prisma generate`

## Technology Stack

- **Node.js & Express**: API Framework.
- **Prisma**: ORM for database management.
- **PostgreSQL**: Hosted on Prisma Accelerate.
- **Prisma Accelerate**: Providing connection pooling and caching.

## Deployment to Render

1.  **Create a New Web Service** on Render.com.
2.  **Connect your GitHub Repository**.
3.  **Root Directory**: Set to `backend` if you are deploying from a monorepo, otherwise leave it empty.
4.  **Environment Configuration**:
    - **Runtime**: `Node`
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
5.  **Environment Variables**:
    - `DATABASE_URL`: Add your Prisma Accelerate URL.
    - `JWT_SECRET`: Add a secure secret for auth.
    - `PORT`: 5000 (usually Render sets this automatically).
6.  **Blueprints**: A `render.yaml` file is provided to simplify this process. You can just use the "Blueprint" feature on Render.

