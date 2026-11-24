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
class NutritionInfo(BaseModel):
    calories: int
    protein_g: Optional[float] = None
    iron_mg: Optional[float] = None
    zinc_mg: Optional[float] = None
    fiber_g: Optional[float] = None
    carbohydrate_g: Optional[float] = None
    total_fat_g: Optional[float] = None
    saturated_fat_g: Optional[float] = None
    cholesterol_mg: Optional[float] = None
    total_sugar_g: Optional[float] = None
    added_sugar_g: Optional[float] = None
    calcium_mg: Optional[float] = None

class MenuItem(BaseModel):
    id: str
    name: str
    nameTamil: Optional[str] = ""
    category: str
    price: float
    costPrice: float
    marginPercent: int
    prepTimeMinutes: int
    popularityText: str
    orderedTodayCount: int
    description: str
    descriptionTamil: Optional[str] = ""
    image: str
    isVeg: bool
    isSpicy: bool
    isAvailable: bool = True
    calories: int
    nutrition: Optional[NutritionInfo] = None
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
menu_items_db: List[Dict[str, Any]] = [
    {
        "id": "item-1",
        "name": "Butter Chicken",
        "nameTamil": "பட்டர் சிக்கன்",
        "category": "Main Course",
        "price": 320.0,
        "costPrice": 198.0,
        "marginPercent": 38,
        "prepTimeMinutes": 12,
        "popularityText": "Ordered 48x today",
        "orderedTodayCount": 48,
        "description": "Tender tandoori chicken simmered in a silky, rich makhani gravy infused with butter and kasuri methi.",
        "descriptionTamil": "வெண்ணெய் மற்றும் மென்மையான தக்காளி கிரேவியில் சமைக்கப்பட்ட தந்தூரி சிக்கன்.",
        "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        "isVeg": False,
        "isSpicy": True,
        "isAvailable": True,
        "calories": 520,
        "nutrition": {
            "calories": 520,
            "protein_g": 29.0,
            "iron_mg": 2.9,
            "zinc_mg": 2.6,
            "fiber_g": 2.4,
            "carbohydrate_g": 14.0,
            "total_fat_g": 32.0,
            "saturated_fat_g": 14.0,
            "cholesterol_mg": 85.0,
            "total_sugar_g": 4.5,
            "added_sugar_g": 0.0,
            "calcium_mg": 110.0
        },
        "allergens": ["Dairy", "Cashews"],
        "customizationOptions": ["Extra Gravy", "Boneless Only"]
    },
    {
        "id": "item-2",
        "name": "Paneer Tikka",
        "nameTamil": "பன்னீர் டிக்கா",
        "category": "Starters",
        "price": 280.0,
        "costPrice": 162.0,
        "marginPercent": 42,
        "prepTimeMinutes": 9,
        "popularityText": "Ordered 42x today",
        "orderedTodayCount": 42,
        "description": "Fresh cottage cheese cubes marinated in spiced yogurt and grilled in traditional clay tandoor with bell peppers.",
        "descriptionTamil": "தயிர் மசாலா கலவையில் ஊறிய சுவையான தந்தூரி பன்னீர்.",
        "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        "isVeg": True,
        "isSpicy": True,
        "isAvailable": True,
        "calories": 380,
        "nutrition": {
            "calories": 380,
            "protein_g": 18.5,
            "iron_mg": 1.8,
            "zinc_mg": 2.4,
            "fiber_g": 2.8,
            "carbohydrate_g": 12.0,
            "total_fat_g": 22.0,
            "saturated_fat_g": 11.0,
            "cholesterol_mg": 35.0,
            "total_sugar_g": 3.2,
            "added_sugar_g": 0.0,
            "calcium_mg": 290.0
        },
        "allergens": ["Dairy"],
        "customizationOptions": ["Extra Mint Chutney", "Lemon Squeeze"]
    },
    {
        "id": "item-4",
        "name": "Steamed Idli with Sambar",
        "nameTamil": "இட்லி சாம்பார்",
        "category": "Starters",
        "price": 120.0,
        "costPrice": 42.0,
        "marginPercent": 65,
        "prepTimeMinutes": 5,
        "popularityText": "Ordered 84x today",
        "orderedTodayCount": 84,
        "description": "Fluffy steamed rice & lentil cakes served with home-style lentil vegetable sambar.",
        "descriptionTamil": "மிருதுவான சுடச்சுட இட்லி மற்றும் சாம்பார்.",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "isVeg": True,
        "isSpicy": False,
        "isAvailable": True,
        "calories": 130,
        "nutrition": {
            "calories": 130,
            "protein_g": 5.2,
            "iron_mg": 1.8,
            "zinc_mg": 1.1,
            "fiber_g": 3.2,
            "carbohydrate_g": 24.0,
            "total_fat_g": 1.2,
            "saturated_fat_g": 0.3,
            "cholesterol_mg": 0.0,
            "total_sugar_g": 0.4,
            "added_sugar_g": 0.0,
            "calcium_mg": 35.0
        },
        "allergens": [],
        "customizationOptions": ["Extra Sambar"]
    }
]

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
@app.get("/api/menu")
def get_menu(health_filters: Optional[str] = None):
    """
    Fetch menu items with optional FSSAI-compliant Health & Nutrition filtering.
    Multiple filters are evaluated using strict AND logic.
    """
    if not health_filters:
        return {"items": menu_items_db, "count": len(menu_items_db)}

    filter_list = [f.strip() for f in health_filters.split(",") if f.strip()]
    if not filter_list:
        return {"items": menu_items_db, "count": len(menu_items_db)}

    filtered = []
    for item in menu_items_db:
        n = item.get("nutrition") or {}
        cals = item.get("calories", n.get("calories", 0))

        matches_all = True
        for f in filter_list:
            fl = f.lower()
            if fl == "high protein" and (n.get("protein_g") or 0) < 12.0:
                matches_all = False; break
            elif fl == "iron rich" and (n.get("iron_mg") or 0) < 3.0:
                matches_all = False; break
            elif fl == "zinc rich" and (n.get("zinc_mg") or 0) < 2.0:
                matches_all = False; break
            elif fl == "high fiber" and (n.get("fiber_g") or 0) < 6.0:
                matches_all = False; break
            elif fl == "low carbohydrate" and (n.get("carbohydrate_g") is None or n.get("carbohydrate_g", 999) > 15.0):
                matches_all = False; break
            elif fl == "low fat" and (n.get("total_fat_g") is None or n.get("total_fat_g", 999) > 3.0):
                matches_all = False; break
            elif fl == "low saturated fat" and (n.get("saturated_fat_g") is None or n.get("saturated_fat_g", 999) > 1.5):
                matches_all = False; break
            elif fl == "low cholesterol" and (n.get("cholesterol_mg") is None or n.get("cholesterol_mg", 999) > 20.0):
                matches_all = False; break
            elif fl == "sugar-free" and (n.get("total_sugar_g") is None or n.get("total_sugar_g", 999) > 0.5):
                matches_all = False; break
            elif fl == "no added sugar" and (n.get("added_sugar_g") is None or n.get("added_sugar_g", 999) > 0.0):
                matches_all = False; break
            elif fl == "low sugar" and (n.get("total_sugar_g") is None or n.get("total_sugar_g", 999) > 5.0):
                matches_all = False; break
            elif fl == "low calorie" and (cals <= 0 or cals > 150):
                matches_all = False; break
            elif fl == "high calorie" and cals < 450:
                matches_all = False; break
            elif fl == "diet-friendly":
                is_df = (cals > 0 and cals <= 250 and (n.get("total_fat_g", 999) <= 6.0) and
                         ((n.get("protein_g") or 0) >= 5.0 or (n.get("fiber_g") or 0) >= 3.0))
                if not is_df:
                    matches_all = False; break
            elif fl == "calcium rich" and (n.get("calcium_mg") or 0) < 150.0:
                matches_all = False; break

        if matches_all:
            filtered.append(item)

    return {"items": filtered, "count": len(filtered), "applied_filters": filter_list}

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
