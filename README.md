# Order Execution Backend

This is a robust, asynchronous order execution backend service built with Node.js, Fastify, and TypeScript. It simulates a decentralized exchange (DEX) aggregator that routes and executes token swaps.

## 🚀 Key Features

*   **Asynchronous Processing:** Uses **BullMQ** and **Redis** to offload heavy order processing tasks from the main API thread.
*   **Real-time Updates:** Implements **WebSockets** combined with **Redis Pub/Sub** to push instant status updates to clients as their orders progress through various states (Routing, Building, Execution).
*   **Reliability:** Includes automatic retry mechanisms with exponential backoff for failed orders.
*   **Data Integrity:** Uses **Prisma** (ORM) with **PostgreSQL** for type-safe database interactions.
*   **Simulated DEX:** Features a mock DEX router that simulates price comparison between different exchanges (e.g., Raydium vs. Meteora) and transaction execution.
*   **Secure:** JWT-based authentication for user routes.

## 🛠️ Tech Stack

*   **Runtime:** Node.js (TypeScript)
*   **Framework:** Fastify
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Queue/Background Jobs:** BullMQ
*   **Caching/PubSub:** Redis
*   **Authentication:** JWT & Bcrypt

## 🏗️ Architecture & Design Decisions

### 1. Separation of Concerns (API vs. Worker)
The system is divided into two distinct processes:
*   **API Server (`src/server.ts`):** Handles HTTP requests, authentication, and WebSocket connections. It places order requests into a queue but does not process them synchronously. This ensures high availability and responsiveness.
*   **Worker (`src/worker.ts`):** Consumes jobs from the queue. It handles the complex logic of routing, price checking, and execution.

### 2. State Machine Workflow
Orders progress through a defined lifecycle, tracked in the database and broadcasted via WebSockets:
1.  **PENDING:** Order received and queued.
2.  **ROUTING:** Worker is calculating the best route (price comparison).
3.  **BUILDING:** Best route selected; transaction is being prepared.
4.  **CONFIRMED:** Transaction successfully executed on the (mock) blockchain.
5.  **FAILED:** Processing failed (after retries).

### 3. Redis Pub/Sub for WebSockets
To scale WebSockets, we use Redis Pub/Sub.
*   The **Worker** publishes events to Redis channels (e.g., `order:123`) when the status changes.
*   The **API Server** subscribes to these channels and forwards the messages to the connected WebSocket client.
*   This decouples the worker from the websocket server, allowing them to scale independently.

## 🔄 Workflow

1.  **User Auth:** User registers/logs in and receives a JWT.
2.  **Create Order:** User sends `POST /api/orders`.
    *   Server saves order to DB (`PENDING`).
    *   Server adds job to `process-order` queue.
    *   Server returns `orderId`.
3.  **Client Connects:** Client connects to WebSocket `ws://localhost:8080/api/ws/orders?orderId={orderId}` to listen for updates.
4.  **Processing:**
    *   Worker picks up the job.
    *   **Routing Phase:** Checks prices on "Raydium" and "Meteora".
    *   **Execution Phase:** Simulates a blockchain transaction delay.
    *   **Completion:** Updates DB to `CONFIRMED` with a mock transaction hash.
5.  **Updates:** Throughout step 4, the Client receives real-time JSON events via the WebSocket.

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL
*   Redis

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/eterna_db?schema=public"
    REDIS_HOST="localhost"
    REDIS_PORT=6379
    JWT_SECRET="your_super_secret_key"
    PORT=8080
    ```

4.  **Database Migration:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the Application:**
    You need to run both the API server and the Worker.

    **Terminal 1 (Server):**
    ```bash
    npm run dev
    ```

    **Terminal 2 (Worker):**
    ```bash
    npm run worker
    ```

## 📡 API Endpoints

### Auth
*   `POST /api/auth/signup` - Register a new user.
*   `POST /api/auth/login` - Login and get JWT.

### Orders
*   `POST /api/orders` - Create a new swap order (Requires Bearer Token).
    *   Body: `{ "tokenIn": "SOL", "tokenOut": "USDC", "amount": 10 }`
*   `GET /api/orders` - Get all orders for the logged-in user.

### WebSockets
*   `WS /api/ws/orders?orderId=<order_id>` - Subscribe to real-time updates for a specific order.
