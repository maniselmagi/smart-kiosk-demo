# OrderEase REST API Specification

Base URL: `http://localhost:8000/api` or `https://orderease-kiosk-live.loca.lt/api`

## Endpoints

### 1. Health Check
- **GET** `/api/health`
- **Response**:
```json
{
  "status": "healthy",
  "database": "active",
  "active_orders": 3
}
```

### 2. Orders Management
- **GET** `/api/orders`
  - Returns active and completed kitchen tickets.
- **POST** `/api/orders`
  - Creates a new customer order.
  - **Payload**:
  ```json
  {
    "tableNumber": 12,
    "items": [
      {
        "cartItemId": "c-101",
        "menuItemId": "item-1",
        "name": "Butter Chicken",
        "price": 320,
        "quantity": 2,
        "spiceLevel": "Hot",
        "customizations": ["Extra Gravy"],
        "specialInstructions": "",
        "image": "https://...",
        "isVeg": false
      }
    ],
    "subtotal": 640,
    "tax": 32,
    "tip": 50,
    "total": 722,
    "paymentMethod": "UPI",
    "splitBillDetails": {
      "type": "equally",
      "guestCount": 2,
      "amountPerGuest": 361
    }
  }
  ```
- **PATCH** `/api/orders/{order_id}/status`
  - Updates order status (`NEW`, `PREPARING`, `READY`, `COMPLETED`).

### 3. Staff & Waiter Alerts
- **GET** `/api/waiter-calls`
  - List of active waiter assistance requests.
- **POST** `/api/waiter-calls`
  - Creates a waiter call request from a specific table.

### 4. Post-Meal Feedback
- **POST** `/api/feedback`
  - Submits a 1-to-5 star rating and comments from table kiosk.

### 5. Analytics & KPIs
- **GET** `/api/analytics/kpis`
  - Returns today's sales, average order value, order volume, and margins.
