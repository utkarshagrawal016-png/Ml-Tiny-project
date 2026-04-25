from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="House Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model.pkl")
print("Looking for model at:", model_path)
model = pickle.load(open(model_path, "rb"))
print("Model loaded successfully")
class HouseInput(BaseModel):
    Area: float
    Bedrooms: int
    Bathrooms: int
    Age: int
    Location: str

@app.get("/")
def home():
    return {"message": "API is running successfully"}

@app.post("/predict")
def predict_price(data: HouseInput):
    print("Location selected:", data.Location)

    input_data = np.array([[data.Area, data.Bedrooms, data.Bathrooms, data.Age]])
    prediction = model.predict(input_data)

    # Simple city-based adjustment
    location_multiplier = 1.0

    if data.Location in ["Mumbai", "Delhi", "Bangalore"]:
        location_multiplier = 1.15  # +15% for major cities
    elif data.Location in ["Noida", "Pune", "Chandigarh"]:
        location_multiplier = 1.08  # +8%

    final_price = prediction[0] * location_multiplier

    return {"predicted_price": round(final_price, 2)}
