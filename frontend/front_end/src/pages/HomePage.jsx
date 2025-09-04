import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";

function Homepage() {
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

  return (
    <>
      <Dashboard />
    </>
  );
}

export default Homepage;
