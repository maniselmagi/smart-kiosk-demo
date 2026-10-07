# OrderEase — Smart Table-Side Self-Ordering Kiosk
### Customer Presentation Demo Prototype (Proposal Review 2026)

[![Cloud Demo Status](https://img.shields.io/badge/Demo-Cloud_Active-success?style=for-the-badge&logo=fastapi)](https://orderease-kiosk-live.loca.lt)
[![Stack](https://img.shields.io/badge/Frontend-React_19_+_TypeScript_+_Vite-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Backend](https://img.shields.io/badge/Backend-Python_FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)

---

## 🌐 Live Cloud Demo Access

| Demo Screen | Direct Public HTTPS Link | Purpose |
| :--- | :--- | :--- |
| **Presentation Hub** | **[Launch Cloud Demo](https://orderease-kiosk-live.loca.lt)** | Main entry point linking Kiosk, Kitchen, and Dashboard |
| **Customer Kiosk** | Direct via Demo Top Bar (`Customer Kiosk` button) | Table 12 ordering tablet experience |
| **Kitchen Display (KDS)** | Direct via Demo Top Bar (`Kitchen KDS` button) | Real-time tickets & preparation line |
| **Management Dashboard** | Direct via Demo Top Bar (`Management` button) | Sales KPIs, peak hours & profitability margins |

> **Note for First Visit**: If the tunnel service presents a friendly security reminder screen, enter the tunnel gateway IP: **`223.185.23.48`** to access the demo.

---

## 🍽️ Executive Summary & Product Proposal Alignment

**OrderEase** is a production-grade concept prototype built directly from the specifications in **Self_Ordering_Kiosk_Product_Proposal.pdf**. It demonstrates how replacing handwritten, manual table ordering with smart table-side kiosks resolves restaurant pain points:

1. **Faster Table Turnover**: Diners browse visual dish photos, customize spice levels, and settle bills without flagging staff.
2. **Eliminated Order Errors**: Digital orders route straight from table to kitchen display with spice and customization notes.
3. **Higher Average Order Value (AOV)**: Upsells and chef pairing combos (e.g., *Paneer Tikka + Cold Coffee — Save ₹40*) lift average checks from ₹265 to ₹328 (+24%).
4. **Data-Driven Operations**: Owners gain real-time visibility into hourly peak rushes, item-level gross margins (38%–58%), and live diner sentiment.

---

## 🔄 End-to-End Business Flow Demonstrated

```text
LANDING HUB
    ↓
CUSTOMER KIOSK (Table 12)
    ↓
WELCOME SCREEN
    ↓
VISUAL MENU (Full dish imagery, prep time, popularity badges)
    ↓
CUSTOMIZE DISH (4-level spice selector: Mild, Medium, Hot, Extra Hot)
    ↓
ADD TO CART & COMBOS
    ↓
CHECKOUT (Split Bill across diners + Optional tipping: 0%, 5%, 10%, 15%, Custom)
    ↓
DEMO PAYMENT (UPI QR code simulation / Card / Wallet)
    ↓
ORDER CONFIRMED (#1025)
    ↓
KITCHEN RECEIVES TICKET (Instant zero-delay sync to KDS)
    ↓
KITCHEN → START PREPARING (Table Kiosk live tracker changes to 'Chef Preparing')
    ↓
KITCHEN → MARK READY (Table Kiosk tracker changes to 'Ready to Serve')
    ↓
DIGITAL RECEIPT (SMS/Email simulation & print)
    ↓
POST-MEAL FEEDBACK (1–5 Stars rating & tags)
    ↓
EXECUTIVE DASHBOARD (KPIs, Peak-Hour analysis, Profitability & Reviews)
```

---

## 📱 Hardware & Responsive Tablet Optimization

- **Restaurant Tablet Native**: Specially styled for **8", 10", 11", and 12" tablets** with large touch targets (min 48px), comfortable spacing, readable typography, and tactile feedback.
- **Landscape & Portrait Modes**: Seamless layout adaptation for table-docked tablets and mobile browsers.
- **Accessibility Mode (A11y)**: 1-tap high-contrast mode with larger text scaling and high legibility for low-vision diners.
- **Multilingual Support**: Real-time bilingual toggle between **English** and **Tamil (தமிழ்)** across all menus, buttons, and callouts.

---

## ⚡ Key Modules & Feature Highlights

### 1. Customer Kiosk
- **Rich Menu Cards**: High-resolution photography, live cooking time estimates (e.g., 12 min), order popularity ("Ordered 48x today"), and dietary indicators (Veg 🌱 / Non-Veg 🍗 / Spicy 🌶️).
- **Spice Level Selector**: Interactive 4-tier visual slider (Mild, Medium, Hot, Extra Hot).
- **Dish Customization**: Checkbox add-ons (*Extra Gravy*, *Less Salt*, *Ghee Roast*) and freeform chef notes.
- **Smart Pairing Combos**: Curated pairings (*Paneer Tikka + Cold Coffee Frappé — Save ₹40*).
- **Split Bill Engine**: Divide evenly across 2 to 5 diners or split by item.
- **Optional Tipping**: 0%, 5%, 10%, 15%, or custom rupee amounts.
- **Call Waiter Matrix**: 4 instant touch options (*Need Assistance*, *Need Water*, *Need Bill*, *Other*) that ring kitchen screens immediately.
- **Digital Receipt**: Printable invoice layout with SMS and Email delivery mockups.

### 2. Kitchen Display System (KDS)
- **4 Ticket Columns**: `NEW` → `PREPARING` → `READY` → `SERVED / ARCHIVE`.
- **Elapsed Timers**: Color-coded wait timers with late-order alerts.
- **Sold-Out Controller**: 1-click toggle to mark any dish *Sold Out* (instantly greys out the dish and disables ordering across all customer kiosks).
- **Waiter Assistance Board**: Live incoming requests from dining tables with 1-click acknowledgment.

### 3. Management Analytics Dashboard
- **Top 4 KPIs**: Today's Sales (₹48,620), Order Count (148), Average Order Value (₹328), Customer Satisfaction (4.7 ★).
- **Peak-Hour Analysis**: Interactive hourly order distribution (10 AM to 10 PM) highlighting the 1 PM lunch rush and 8 PM dinner peak.
- **Menu Profitability Matrix**: Item margin engineering (Price vs. Ingredient COGS) flagging items with 38% to 58% gross margins.
- **Top vs. Lowest Performing Dishes**: Ranked by volume and revenue contribution.
- **Live Feedback Stream**: Real-time guest reviews collected from kiosks after dining.

---

## 🔑 Demo Access & Role Credentials

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Kitchen Staff (KDS)** | `kitchen_demo` | `demo123` | Direct access via demo navigation bar |
| **Management Dashboard** | `admin_demo` | `demo123` | Pre-authenticated for frictionless customer presentation |

---

## 🛠️ Technology Stack & Project Structure

```text
self-ordering-kiosk/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Header, DemoNavigation, CallWaiterModal
│   │   │   ├── hub/              # LandingHub presentation portal
│   │   │   ├── kiosk/            # Welcome, Menu, FoodDetail, Cart, Checkout, Receipt, Tracker, Feedback
│   │   │   ├── kitchen/          # KitchenDisplay (KDS), Sold-out controller
│   │   │   └── dashboard/        # ManagementDashboard, KPI charts, margins
│   │   ├── context/              # KioskContext (reactive state engine)
│   │   ├── services/             # StorageService (BroadcastChannel + LocalStorage sync)
│   │   ├── types/                # Strict TypeScript domain interfaces
│   │   ├── utils/                # English & Tamil translations dictionary
│   │   └── data/                 # Realistic seed data from customer proposal
│   ├── Dockerfile
│   └── package.json
│
├── backend/                      # Python FastAPI microservice
│   ├── main.py                   # REST API endpoints (Orders, Status, Waiter, Analytics)
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/                         # Specifications & system design
│   ├── architecture.md           # Sequence diagrams & tablet design rules
│   └── api_specification.md      # REST API contracts
│
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Secrets & build hygiene
├── docker-compose.yml            # Multi-container local orchestration
├── vercel.json                   # 1-click Vercel deployment spec
├── netlify.toml                  # 1-click Netlify deployment spec
└── README.md                     # Customer presentation documentation
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ (tested on Node v24)
- Python 3.10+ (optional for backend API)

### Step 1: Run the Frontend Kiosk
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 2: Run the Backend Service (Optional)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
FastAPI server runs at [http://localhost:8000](http://localhost:8000) with interactive Swagger documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### Step 3: Run with Docker Compose
```bash
docker-compose up --build
```

---

## ☁️ Cloud Deployment Instructions

### Deploy to Vercel (1-Click)
1. Push this repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select this repo.
3. Set **Root Directory** to `frontend`.
4. Deploy! All routes and rewrites in `vercel.json` are automatically configured.

### Deploy to Netlify
1. Connect this repo to Netlify.
2. Build command: `npm run build`, Publish directory: `dist`, Base: `frontend`.
3. The included `netlify.toml` automatically configures SPA routing.

---

## 🔬 What is Simulated vs. Actually Implemented

As requested in the customer proposal prototype scope:

| Feature Area | Implementation Status | Presentation Details |
| :--- | :--- | :--- |
| **Menu Browsing & Search** | **Fully Implemented** | Live client filtering by categories, search keywords, veg/non-veg, and spicy filters. |
| **Spice & Add-on Customization** | **Fully Implemented** | 4-level spice selector, checkboxes, and notes dynamically calculate prices and persist to kitchen tickets. |
| **Multi-Screen Synchronization** | **Fully Implemented** | Uses `BroadcastChannel` with 0ms delay across tabs/windows on the same machine and local storage persistence. |
| **Split Bill Calculation** | **Fully Implemented** | Accurate mathematical division across diners with per-guest share calculation. |
| **Payment Gateway** | **Simulated Demo Mode** | Realistic UPI QR code, Card, and Wallet selection with animated processing spinner. *No actual bank charges are initiated.* |
| **SMS / Email Receipt** | **Simulated Demo Mode** | Validates phone/email input and displays success dispatch feedback without incurring SMS provider charges. |
| **AI Combo Suggestions** | **Rule-Based Demo Mode** | Demonstrates the upsell UX using curated high-margin dish combinations rather than an uncalibrated ML model. |
| **Dish Profitability** | **Simulated Demo Metrics** | Demonstrates restaurant margin analysis (38% to 58%) based on proposal data without pulling live supplier invoices. |

---

## 💼 Presentation Script & Customer Walkthrough Tip

To deliver an unforgettable demonstration during the customer presentation:

1. **Dual Window Setup**:
   - Open **Window 1** (left half of screen): Customer Kiosk on Table 12.
   - Open **Window 2** (right half of screen): Kitchen Display System.
2. **Step 1**: On Window 1, customize *Butter Chicken* (Hot Spice, Extra Gravy) and add the *Paneer Tikka + Cold Coffee* Combo.
3. **Step 2**: Settle the bill using Demo UPI and click **Confirm Order**.
4. **Step 3**: Point out to the customer how the ticket **instantly appears on Window 2** (Kitchen KDS) under `NEW`.
5. **Step 4**: In Window 2, click **Start Preparing**. Watch Window 1 update in real time to show **Chef Preparing**.
6. **Step 5**: In Window 2, switch to the *Sold Out Controller* and mark *Paneer Tikka* Sold Out. Watch Window 1 instantly disable the dish!
7. **Step 6**: Switch to the **Management Dashboard** to show how the order has fed today's sales, average order value, and guest sentiment metrics.
