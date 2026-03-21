import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function Charts({ form, history }) {
  const featureData = {
    labels: Object.keys(form),
    datasets: [
      {
        label: "Input Features",
        data: Object.values(form).map((v) => Number(v) || 0),
        backgroundColor: "rgba(155, 92, 255, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const priceTrendData = {
    labels: history.map((_, i) => `Run ${i + 1}`),
    datasets: [
      {
        label: "Predicted Price Trend",
        data: history,
        borderColor: "#9bffb7",
        backgroundColor: "rgba(155,255,183,0.25)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="charts">
      <div className="chart-card">
        <h3>📊 Feature Distribution</h3>
        <div style={{ height: "260px" }}>
          <Bar data={featureData} options={commonOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3>📈 Prediction Trend</h3>
        <div style={{ height: "260px" }}>
          <Line data={priceTrendData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
}

export default Charts;
