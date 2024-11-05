import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css'; // Include CSS styles
import disasterImage from './assets/aid.jpg'; // Replace with actual image path

const Dashboard = () => {
  const navigate = useNavigate();

  const handleResourceAllocationClick = () => {
    navigate('/allocate-resource');
  };

  const handleNgoCoordinationClick = () => {
    navigate('/ngo-coordination');
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>AidTech</h2>
        <ul>
          <li>
            <Link to="/heatmaps">Heatmaps</Link>
          </li>
          <li onClick={handleResourceAllocationClick}>
            NGO Resource Information
          </li>
          <li onClick={handleNgoCoordinationClick}>NGO Coordination</li>
        </ul>
        <button onClick={() => navigate('/real-time-updates')}>
          Real-Time Updates
        </button>
      </div>

      <div className="content-container">
        <img
          src={disasterImage}
          alt="Volunteers assisting in disaster management"
          className="dashboard-image"
        />
        <h3 style={{ color: '#2c3e50' }}>Welcome to AidTech</h3>
        <p style={{ color: '#7f8c8d', textAlign: 'center', maxWidth: '600px' }}>
          AidTech provides real-time updates and resources to support disaster relief efforts.
          Browse through our heatmaps, resource information, and coordination tools to find what you need.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
