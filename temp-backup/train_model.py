import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle
import os

print("Training started...")

# Create sample data
data = {
    "Area": [800, 900, 1200, 1500, 1800],
    "Bedrooms": [2, 2, 3, 3, 4],
    "Bathrooms": [1, 2, 2, 3, 3],
    "Age": [10, 8, 5, 3, 1],
    "Price": [4000000, 4500000, 6000000, 7500000, 9000000]
}

df = pd.DataFrame(data)

X = df[["Area", "Bedrooms", "Bathrooms", "Age"]]
y = df["Price"]

model = LinearRegression()
model.fit(X, y)

# Absolute path check
model_path = os.path.join(os.getcwd(), "model.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print("Model saved at:", model_path)
