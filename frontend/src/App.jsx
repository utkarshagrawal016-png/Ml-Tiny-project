import { useState, useRef } from "react";
import { predictPrice } from "./services/api";
import Charts from "./components/Charts";
import "./App.css";

const INDIAN_CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Jaipur",
  "Chandigarh",
  "Noida",
];

function App() {
  const [form, setForm] = useState({
    Area: "",
    Bedrooms: "",
    Bathrooms: "",
    Age: "",
    Location: "Delhi",
  });

  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const cardRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Mouse-following 3D effect
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 15;
    const y = (e.clientY - top - height / 2) / 15;

    card.style.transform = `rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
  };

  const resetTilt = () => {
    cardRef.current.style.transform = "rotateX(10deg) rotateY(-10deg)";
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setPrice(null);

      const result = await predictPrice({
        Area: Number(form.Area),
        Bedrooms: Number(form.Bedrooms),
        Bathrooms: Number(form.Bathrooms),
        Age: Number(form.Age),
        Location: form.Location,
      });

      const newRecord = {
        ...form,
        predicted: result.predicted_price,
        time: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [...prev, newRecord]);

      let count = 0;
      const target = result.predicted_price;
      const step = target / 40;

      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          setPrice(target);
          clearInterval(interval);
        } else {
          setPrice(Math.floor(count));
        }
      }, 20);

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>
      {/* THEME TOGGLE */}
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div
          className="card-3d"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
        >
          <h1>🏠 House Price Predictor</h1>
          <p className="subtitle">AI Powered • FastAPI • React</p>

          <div className="inputs">
            {["Area", "Bedrooms", "Bathrooms", "Age"].map((key) => (
              <div className="input-group" key={key}>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  required
                />
                <label>{key}</label>
              </div>
            ))}

            {/* SIMPLE LOCATION DROPDOWN */}
            <div className="input-group">
              <select
                name="Location"
                value={form.Location}
                onChange={handleChange}
              >
                {INDIAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <label className="select-label">Location (India)</label>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "🔄 Predicting..." : "Predict Price"}
          </button>

          {price && (
            <div className="result">
              ₹ {Number(price).toLocaleString("en-IN")}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <Charts form={form} history={history.map(h => h.predicted)} />

        {/* HISTORY TABLE */}
        <div className="history-card">
          <h3>📜 Prediction History</h3>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Area</th>
                <th>BHK</th>
                <th>Bath</th>
                <th>Age</th>
                <th>Location</th>
                <th>Predicted (₹)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={i}>
                  <td>{row.time}</td>
                  <td>{row.Area}</td>
                  <td>{row.Bedrooms}</td>
                  <td>{row.Bathrooms}</td>
                  <td>{row.Age}</td>
                  <td>{row.Location}</td>
                  <td>{Number(row.predicted).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
