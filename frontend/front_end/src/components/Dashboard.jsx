import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [originalUserData, setOriginalUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/getrating", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        const users = response.data.users;
        setOriginalUserData(users);

        const sortedUsers = [...users].sort((a, b) => {
          const totalA = (parseInt(a.codeforces_rating) || 0) + (parseInt(a.codechef_rating) || 0);
          const totalB = (parseInt(b.codeforces_rating) || 0) + (parseInt(b.codechef_rating) || 0);
          return totalB - totalA;
        });
        setUserData(sortedUsers);
      } catch (err) {
        setError("Failed to fetch user ratings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ** THIS FUNCTION IS NOW FIXED **
  const handleSort = (key) => {
    let newDirection = 'desc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'desc') {
        newDirection = 'asc';
      } else if (sortConfig.direction === 'asc') {
        key = 'total';
        newDirection = 'desc';
      }
    }
    
    let sortedData = [...originalUserData];

    // Unified sorting logic for all columns
    sortedData.sort((a, b) => {
      let valA, valB;

      // First, determine which values we are comparing
      if (key === 'total') {
        valA = (parseInt(a.codeforces_rating) || 0) + (parseInt(a.codechef_rating) || 0);
        valB = (parseInt(b.codeforces_rating) || 0) + (parseInt(b.codechef_rating) || 0);
      } else {
        // This handles 'codeforces_rating' and 'codechef_rating'
        valA = parseInt(a[key]) || 0;
        valB = parseInt(b[key]) || 0;
      }

      // Then, apply the correct sort direction
      return newDirection === 'asc' ? valA - valB : valB - valA;
    });
    
    setUserData(sortedData);
    setSortConfig({ key, direction: newDirection });
  };
  
  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'desc' ? ' 🔽' : ' 🔼';
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading user ratings...</p></div>;
  }
  if (error) {
    return <div className="dashboard-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th onClick={() => handleSort('codeforces_rating')} style={{ cursor: 'pointer' }}>
                Codeforces Rating{getSortArrow('codeforces_rating')}
              </th>
              <th onClick={() => handleSort('codechef_rating')} style={{ cursor: 'pointer' }}>
                CodeChef Rating{getSortArrow('codechef_rating')}
              </th>
              <th onClick={() => handleSort('total')} style={{ cursor: 'pointer' }}>
                Total{getSortArrow('total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.codeforces_rating || 'N/A'}</td>
                <td>{user.codechef_rating || 'N/A'}</td>
                <td>{(parseInt(user.codeforces_rating) || 0) + (parseInt(user.codechef_rating) || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;