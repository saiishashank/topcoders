import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css";

function Dashboard() {
  // State to hold the combined user and rating data
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        // Only one API call is needed as /getrating returns all required data
        const response = await axios.get(
          "http://localhost:5000/api/user/getrating",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // The response.data.users is the array we need
        setUserData(response.data.users); 
      } catch (err) {
        setError("Failed to fetch user ratings. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading user ratings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Codeforces Rating</th>
              <th>CodeChef Rating</th>
            </tr>
          </thead>
          <tbody>
            {/* Map directly over the userData state */}
            {userData.map((user) => (
              // Use a unique property like username for the key
              <tr key={user.username}> 
                <td>{user.username}</td>
                {/* Access the rating properties directly from the user object */}
                <td>{user.codeforcesrating}</td>
                <td>{user.codechefrating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;