import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="NightRide API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes data ──────────────────────────────────────────────

ROUTES = [
    {"id": 1, "from": "Bundoora", "to": "Preston", "price": 4, "departure": "9:00 PM", "arrival": "9:20 PM", "max_seats": 6},
    {"id": 2, "from": "Bundoora", "to": "Thomastown", "price": 5, "departure": "9:30 PM", "arrival": "9:55 PM", "max_seats": 4},
    {"id": 3, "from": "Bundoora", "to": "Epping", "price": 6, "departure": "10:00 PM", "arrival": "10:35 PM", "max_seats": 8},
    {"id": 4, "from": "Bundoora", "to": "Wollert", "price": 8, "departure": "10:45 PM", "arrival": "11:25 PM", "max_seats": 3},
    {"id": 5, "from": "Bundoora", "to": "Craigieburn", "price": 10, "departure": "11:30 PM", "arrival": "12:10 AM", "max_seats": 5},
]


# ── Pydantic models ─────────────────────────────────────────

class BookingCreate(BaseModel):
    user_email: str
    pickup_stop: str
    departure_time: str
    arrival_time: str
    contact_number: str
    price: float
    travel_date: str
    seats_count: int


# ── Endpoints ────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "NightRide API running"}


@app.get("/routes")
def get_routes():
    return {"routes": ROUTES}


@app.post("/bookings")
def create_booking(booking: BookingCreate):
    try:
        result = supabase.table("bookings").insert(booking.model_dump()).execute()
        return {"booking": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/bookings/{user_email}")
def get_bookings(user_email: str):
    try:
        result = (
            supabase.table("bookings")
            .select("*")
            .eq("user_email", user_email)
            .order("created_at", desc=True)
            .execute()
        )
        return {"bookings": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))