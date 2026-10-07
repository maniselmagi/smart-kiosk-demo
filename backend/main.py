"""
OrderEase - Smart Table-Side Self-Ordering Kiosk
Lightweight Demo Backend API (FastAPI)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

app = FastAPI(
    title="OrderEase Kiosk API",
    description="Backend synchronization and analytics service for OrderEase Table-Side Kiosks",
    version="1.0.0"
)

# Enable CORS for local and cloud clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class MenuItem(BaseModel):
    id: str
    name: str
    nameTamil: str
    category: str
    price: float
    costPrice: float
    marginPercent: int
    prepTimeMinutes: int
    popularityText: str
    orderedTodayCount: int
    description: str
    descriptionTamil: str
    image: str
    isVeg: bool
    isSpicy: bool
    isAvailable: bool = True
    calories: int
    allergens: List[str]
    customizationOptions: List[str]

class CartItemModel(BaseModel):
    cartItemId: str
    menuItemId: str
    name: str
    price: float
    quantity: int
    spiceLevel: str
    customizations: List[str] = []
    specialInstructions: str = ""
    image: str
    isVeg: bool

class CreateOrderRequest(BaseModel):
    tableNumber: int
    items: List[CartItemModel]
    subtotal: float
    tax: float
    tip: float = 0.0
    total: float
    paymentMethod: str = "UPI"
    splitBillDetails: Optional[Dict[str, Any]] = None

class OrderStatusUpdate(BaseModel):
    status: str # NEW, PREPARING, READY, COMPLETED

class WaiterCallRequest(BaseModel):
    tableNumber: int
    type: str # Need Assistance, Need Water, Need Bill, Other

class FeedbackRequest(BaseModel):
    orderNumber: int
    tableNumber: int
    rating: int
    tags: List[str] = []
    comment: str

# --- In-Memory Seed Storage ---
orders_db: List[Dict[str, Any]] = [
    {
        "id": "ORD-1022",
        "orderNumber": 1022,
        "tableNumber": 4,
        "items": [
            {"name": "Veg Dum Biryani", "quantity": 1, "price": 240, "spiceLevel": "Medium"}
        ],
        "total": 576,
        "status": "COMPLETED",
        "createdAt": datetime.utcnow().isoformat(),
        "paymentStatus": "PAID"
    },
    {
        "id": "ORD-1023",
        "orderNumber": 1023,
        "tableNumber": 8,
        "items": [
            {"name": "Butter Chicken", "quantity": 1, "price": 320, "spiceLevel": "Hot"},
            {"name": "Garlic Butter Naan", "quantity": 3, "price": 60, "spiceLevel": "Mild"}
        ],
        "total": 550,
        "status": "READY",
        "createdAt": datetime.utcnow().isoformat(),
        "paymentStatus": "PAID"
    },
    {
        "id": "ORD-1024",
        "orderNumber": 1024,
        "tableNumber": 6,
        "items": [
            {"name": "Paneer Tikka", "quantity": 1, "price": 280, "spiceLevel": "Medium"},
            {"name": "Crispy Masala Dosa", "quantity": 2, "price": 160, "spiceLevel": "Mild"}
        ],
        "total": 670,
        "status": "PREPARING",
        "createdAt": datetime.utcnow().isoformat(),
        "paymentStatus": "PAID"
    }
]

waiter_calls_db: List[Dict[str, Any]] = [
    {
        "id": "alert-1",
        "tableNumber": 7,
        "type": "Need Water",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "PENDING"
    }
]

feedback_db: List[Dict[str, Any]] = [
    {
        "id": "fb-1",
        "orderNumber": 1019,
        "tableNumber": 12,
        "rating": 5,
        "tags": ["Food Quality", "Speed of Service"],
        "comment": "Butter Chicken was rich and delicious! Table ordering took less than 2 minutes.",
        "timestamp": "Today, 1:45 PM"
    },
    {
        "id": "fb-2",
        "orderNumber": 1020,
        "tableNumber": 5,
        "rating": 5,
        "tags": ["Kiosk Ease of Use", "Fast Service"],
        "comment": "Very easy ordering experience. Great visual photos of the dishes!",
        "timestamp": "Today, 2:10 PM"
    }
]

# --- Endpoints ---
@app.get("/")
def root():
    return {
        "service": "OrderEase Kiosk Backend",
        "status": "online",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "active", "active_orders": len(orders_db)}

@app.get("/api/orders")
def get_orders():
    return {"orders": orders_db}

@app.post("/api/orders")
def create_order(req: CreateOrderRequest):
    next_order_num = (orders_db[0]["orderNumber"] if orders_db else 1024) + 1
    new_order = {
        "id": f"ORD-{next_order_num}",
        "orderNumber": next_order_num,
        "tableNumber": req.tableNumber,
        "items": [item.dict() for item in req.items],
        "subtotal": req.subtotal,
        "tax": req.tax,
        "tip": req.tip,
        "total": req.total,
        "status": "NEW",
        "createdAt": datetime.utcnow().isoformat(),
        "paymentStatus": "PAID",
        "paymentMethod": req.paymentMethod,
        "splitBillDetails": req.splitBillDetails
    }
    orders_db.insert(0, new_order)
    return {"success": True, "order": new_order}

@app.patch("/api/orders/{order_id}/status")
def update_order_status(order_id: str, update: OrderStatusUpdate):
    for order in orders_db:
        if order["id"] == order_id:
            order["status"] = update.status
            order["updatedAt"] = datetime.utcnow().isoformat()
            return {"success": True, "order": order}
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/api/waiter-calls")
def get_waiter_calls():
    return {"alerts": waiter_calls_db}

@app.post("/api/waiter-calls")
def create_waiter_call(req: WaiterCallRequest):
    new_alert = {
        "id": f"alert-{uuid.uuid4().hex[:6]}",
        "tableNumber": req.tableNumber,
        "type": req.type,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "PENDING"
    }
    waiter_calls_db.insert(0, new_alert)
    return {"success": True, "alert": new_alert}

@app.post("/api/feedback")
def submit_feedback(req: FeedbackRequest):
    new_fb = {
        "id": f"fb-{uuid.uuid4().hex[:6]}",
        "orderNumber": req.orderNumber,
        "tableNumber": req.tableNumber,
        "rating": req.rating,
        "tags": req.tags,
        "comment": req.comment,
        "timestamp": "Just now"
    }
    feedback_db.insert(0, new_fb)
    return {"success": True, "feedback": new_fb}

@app.get("/api/analytics/kpis")
def get_kpis():
    return {
        "todaysSales": 48620,
        "totalOrders": 148,
        "averageOrderValue": 328,
        "averageRating": 4.7,
        "bestSellingDishes": [
            {"name": "Butter Chicken", "orders": 48, "revenue": 15360, "margin": "38%"},
            {"name": "Paneer Tikka", "orders": 42, "revenue": 11760, "margin": "42%"},
            {"name": "Veg Dum Biryani", "orders": 51, "revenue": 12240, "margin": "51%"},
            {"name": "Crispy Masala Dosa", "orders": 65, "revenue": 10400, "margin": "55%"},
            {"name": "Cold Coffee Frappé", "orders": 58, "revenue": 8120, "margin": "58%"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
