import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; 
import '../css/competitions.css';

function Competitions() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    const fetchAllContests = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        
        
        const [codechefResponse, codeforcesResponse] = await Promise.all([
          axios.get(`${proxyUrl}https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all`),
          axios.get('https://codeforces.com/api/contest.list?phase=BEFORE')
        ]);

        const allNewContests = [];

        
        if (codechefResponse.status === 200 && codechefResponse.data.future_contests) {
          const codechefContests = codechefResponse.data.future_contests.slice(0, 2).map(contest => ({
            name: contest.contest_name,
            url: `https://www.codechef.com/${contest.contest_code}`,
            startTime: new Date(contest.contest_start_date_iso).toLocaleString(),
            platform: 'CodeChef'
          }));
          allNewContests.push(...codechefContests);
        }

        if (codeforcesResponse.status === 200 && codeforcesResponse.data.result) {
          const codeforcesContests = codeforcesResponse.data.result.slice(0, 2).map(contest => ({
            name: contest.name,
            url: `https://codeforces.com/contests/${contest.id}`,
            startTime: new Date(contest.startTimeSeconds * 1000).toLocaleString(),
            platform: 'Codeforces'
          }));
          allNewContests.push(...codeforcesContests);
        }

        
        allNewContests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

       
        setContests(allNewContests);

      } catch (err) {
        console.error("Error fetching contest details:", err);
        setError("Could not fetch contest details. The CORS proxy might be down or you may have been rate-limited.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllContests();
  }, []); 

  if (loading) {
    return <div>Loading upcoming contests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="competitions-container">
        <h1 className='title'>Upcoming Contests</h1>
        <div className="contests-list">
          {contests.map((contest, index) => (
            <div key={index} className="contest-card">
              <span className={`platform-badge ${contest.platform.toLowerCase()}`}>{contest.platform}</span>
              <h2 className="contest-name">
                <a href={contest.url} target="_blank" rel="noopener noreferrer">
                  {contest.name}
                </a>
              </h2>
              <p className="contest-time">Starts: {contest.startTime}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Competitions;