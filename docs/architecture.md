# OrderEase Kiosk — System Architecture & Flow

## Overview
OrderEase is a table-side smart self-ordering kiosk prototype developed for restaurant presentations. It connects the diner at the table, the kitchen staff on the line, and restaurant leadership in management in one unified, real-time reactive workflow.

---

## 1. End-to-End Business Flow

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Diner (Table Kiosk)
    actor Kitchen as Chef (Kitchen KDS)
    actor Manager as Management (Dashboard)

    Note over Guest,Manager: 1. GUEST ORDERS
    Guest->>Guest: Browses visual menu, prep times, popularity tags
    Guest->>Guest: Customizes spice level (Mild, Medium, Hot, Extra Hot)
    Guest->>Guest: Adds combo recommendations (Save ₹40)
    Guest->>Guest: Reviews cart, selects split bill & optional tip
    Guest->>Guest: Completes demo payment (UPI / Card / Wallet)
    
    Note over Guest,Kitchen: 2. KITCHEN RECEIVES
    Guest-->>Kitchen: Instant broadcast ticket (#1025, Table 12)
    Kitchen->>Kitchen: Ticket appears in 'NEW' column with elapsed timer
    
    Note over Guest,Kitchen: 3. MEAL PREPARED
    Kitchen->>Kitchen: Chef clicks 'Start Preparing'
    Kitchen-->>Guest: Kiosk live tracker updates: 'Chef Preparing'
    Kitchen->>Kitchen: Chef plates dishes and clicks 'Ready to Serve'
    Kitchen-->>Guest: Kiosk live tracker updates: 'Ready / On the way'
    
    Note over Guest,Manager: 4. SERVICE & FEEDBACK
    Guest->>Guest: Views digital receipt (Print / SMS / Email demo)
    Guest->>Guest: Submits 5-star rating & sentiment tags
    Guest-->>Manager: Real-time sync to Executive Dashboard
    
    Note over Kitchen,Manager: 5. DATA SYNCS
    Manager->>Manager: Sales, AOV, Peak-hour chart & margins update live
```

---

## 2. Technical Stack

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite | Ultra-fast rendering, strict type-safety |
| **Styling** | Tailwind CSS + Google Fonts (Outfit & Inter) | Tailored culinary aesthetic, tablet kiosk touch layout |
| **Icons** | Lucide React | High-contrast touch indicators |
| **State & Sync** | React Context + BroadcastChannel + LocalStorage | Zero-latency cross-tab and cross-screen live synchronization |
| **Backend API** | Python 3.11 + FastAPI + Pydantic | Lightweight microservice for cloud and POS integration |
| **Deployment** | HTTPS Cloud Tunnel + Vercel / Netlify configs | Public cloud URL for customer proposal review |

---

## 3. Tablet Responsive Design Matrix

The kiosk interface is purposefully crafted for restaurant tablet hardware:

- **10" to 12" Tablets (Landscape)**: Primary target device mounted on table docks. Two-column visual layout with touch targets larger than 48px.
- **8" to 10" Tablets (Portrait)**: Single-column scrollable grid with floating action drawer for instant cart review.
- **Desktop (1280px+)**: Multi-window presentation mode allows presenter to run Kiosk on left monitor and Kitchen KDS on right monitor.
- **Mobile (320px–767px)**: Handheld responsive ordering experience.

---

## 4. Sold-Out & Call Waiter Architecture

1. **Sold-Out Control**:
   - Kitchen staff toggle an item (e.g. *Paneer Tikka*) to *Sold Out*.
   - A `MENU_UPDATED` message broadcasts to all table kiosks.
   - The dish card instantly displays a *Sold Out* badge and disables the *Add* button.

2. **Call Waiter Alert Matrix**:
   - Diner taps *Call Waiter* on table kiosk (Need Assistance, Need Water, Need Bill, Other).
   - Staff/Kitchen displays an urgent alert badge on Table 12 with elapsed call timer.
   - Waiter acknowledges and dismisses alert once attended.
