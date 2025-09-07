import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../css/RatingGraph.css';

// Register the required components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

// Helper function to process data for the "Combined" rating line
const createCombinedData = (historyData) => {
    const sortedData = [...historyData].sort((a, b) => new Date(a.contest_date) - new Date(b.contest_date));
    let lastCodechefRating = null;
    let lastCodeforcesRating = null;
    const combined = [];

    for (const event of sortedData) {
        if (event.platform === 'codechef') lastCodechefRating = event.rating;
        else if (event.platform === 'codeforces') lastCodeforcesRating = event.rating;

        if (lastCodechefRating !== null && lastCodeforcesRating !== null) {
            combined.push({
                x: new Date(event.contest_date),
                y: Math.round((lastCodechefRating + lastCodeforcesRating) / 2),
            });
        }
    }
    return combined;
};

const RatingGraph = ({ token }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatingHistory = async () => {
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/user/me/getmyratinghistory", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data. Please ensure you are logged in and the server is running.");
        }

        const historyData = await response.json();
        
        if (historyData.length === 0) {
          throw new Error("No rating history found for this user.");
        }

        const combinedData = createCombinedData(historyData);

        setChartData({
          datasets: [
            {
              label: 'Rating',
              data: combinedData,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.1,
              fill: true,
            },
          ],
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingHistory();
  }, [token]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Rating History', font: { size: 20 } },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'MMM dd, yyyy' },
        
      },
    
    },
  };

  return (
    <div className="pageWrapper">

      <div className="chartContainer">
        {loading && <p>Loading Chart...</p>}
        {error && <p className="errorText">Error: {error}</p>}
        {chartData && !loading && !error && (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
};

export default RatingGraph;