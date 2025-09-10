import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchdata = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/getme", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user data, redirecting to login.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const user = await res.json();
        console.log("user", user);
        setData(user[0].username);
      } catch (error) {
        console.error("An error occurred during fetch:", error);
      }
    };

    fetchdata();
  }, [navigate]);
  

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">TopCoders</Link>
      </div>
      <div className="navbar-user">
        <button onClick={toggleDropdown} className="username-button">
          {data} <span className="arrow-down">▼</span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/graph" className="dropdown-item">
              Your Profile
            </Link>
            <button onClick={handleLogout} className="dropdown-item">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;