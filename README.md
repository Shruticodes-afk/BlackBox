# ⬛ BlackBox

**The ultimate dependency simulation engine for predicting service failures before they cascade.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-ccff00?style=for-the-badge&logo=vercel&logoColor=black)](#live-demo)

---

## 🌩️ The Problem

Modern distributed systems rely on intricate webs of dependencies. When a core microservice fails (like an Auth Gateway or Database Pool), the downstream effects are often unpredictable, leading to massive outages. Teams struggle to understand the full blast radius of a single node failure until it happens in production.

**BlackBox solves this.** By intentionally simulating outages (Chaos Engineering), you can map the exact blast radius of every microservice in real-time. It visualizes the lifecycle of a request as it hits timeouts, trips circuit breakers, and cascades into failures—all logged meticulously in the Digital Black Box.

---

## ✨ Key Features

- **Real-Time Dependency Graph:** Live, interactive visualization of services, features, and their relationships powered by React Flow and Supabase WebSockets.
- **Chaos Simulations:** Instantly "kill" backend services with a click to observe the cascading blast radius.
- **Criticality Scoring:** Automatically calculates severity scores based on how many user-facing features are destroyed by a service failure.
- **Dynamic Project Uploads:** Generic architecture allows you to upload any custom `.json` schema to instantly generate and simulate your own system's graph.
- **Interactive Tracing:** Follow step-by-step trace logs of exactly how and why a feature failed (e.g., 504 Gateway Timeouts, TCP Resets).

![Hero Section Placeholder](https://via.placeholder.com/1000x500.png?text=Hero+Section+Screenshot)
![Dashboard Placeholder](https://via.placeholder.com/1000x500.png?text=Live+Dashboard+Screenshot)

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v4
- React Flow (Node-based UI)
- Three.js & WebGL (Kinetic globe visual)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- RESTful API

**Database & Real-Time:**
- Supabase (PostgreSQL)
- Supabase Realtime (WebSockets)

---

## 🧠 How It Works

```mermaid
graph TD
    A[Upload JSON Schema] -->|Parses & Validates| B(Frontend Client)
    B -->|Batch Inserts| C[(Supabase DB)]
    C -->|Realtime WebSockets| D[React Flow Graph]
    
    D -->|Click "Simulate Outage"| E{Backend API}
    E -->|Updates Status| C
    E -->|BFS Traversal| F[Identify Blast Radius]
    F -->|Staggered Updates| C
    
    C -->|Broadcasts Changes| D
    D -->|Visualizes Cascade| G[Digital Black Box Logs]
```

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Shruticodes-afk/BlackBox.git
cd BlackBox
```

### 2. Database Setup (Supabase)
Create a new Supabase project and execute the SQL to create the following tables:
- `services` (id, name, status, criticality_score, project)
- `features` (id, name, status, project)
- `dependencies` (id, feature_id, service_id)
- `trace_logs` (id, request_id, step, status, timestamp)

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```
Start the backend server:
```bash
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001/api
```
Start the Vite development server:
```bash
npm run dev
```

---

## 📂 Example JSON Format

BlackBox isn't just for our demos—you can map **your own architecture**. 

Go to the Live Dashboard, click **Upload Project JSON**, and upload a file following this exact structure:

```json
{
  "project": "E-Commerce Platform",
  "services": [
    { "name": "PaymentGateway", "criticality": 95 },
    { "name": "Database", "criticality": 90 },
    { "name": "AuthProvider", "criticality": 70 },
    { "name": "EmailService", "criticality": 30 },
    { "name": "CDN", "criticality": 40 },
    { "name": "SearchEngine", "criticality": 50 }
  ],
  "features": [
    { "name": "Checkout", "dependsOn": ["PaymentGateway", "Database"] },
    { "name": "Login", "dependsOn": ["AuthProvider"] },
    { "name": "Signup", "dependsOn": ["AuthProvider", "Database"] },
    { "name": "ProductSearch", "dependsOn": ["SearchEngine", "CDN"] },
    { "name": "OrderConfirmationEmail", "dependsOn": ["EmailService"] },
    { "name": "ProductBrowsing", "dependsOn": ["CDN"] },
    { "name": "Wishlist", "dependsOn": ["Database", "AuthProvider"] },
    { "name": "OrderHistory", "dependsOn": ["Database", "AuthProvider"] }
  ]
}
```
*See the attached [`sample-project.json`](sample-project.json) file in the root directory for reference.*

---

## 🔗 Live Demo

**Frontend:** [Insert Vercel Link Here]  
**Backend:** [Insert Render Link Here]

---

## 🔮 Future Improvements

- **Multi-Tier Dependencies:** Allow services to depend on other services (rather than just features depending on services) for deeper topological sorting.
- **Historical Snapshots:** Save graph states to rewind and replay past simulation events.
- **Automated CI/CD Integration:** Trigger chaos tests directly from GitHub Actions during staging deployments.
- **Metrics Dashboard:** Graphing recovery times (MTTR) and service reliability scores over time.

---

## 👥 Credits / Team

Built by Shruti.
