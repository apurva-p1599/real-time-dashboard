import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaHandsHelping, FaSyncAlt , FaBoxOpen} from 'react-icons/fa';
import './Dashboard.css';
import disasterImage from './assets/Disasterimg.jpg'; // Replace with your own image

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
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <h1>AID<span>TECH </span>INNOVATORS</h1>
        </div>
        <nav className="navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          
     
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${disasterImage})` }}>
        <div className="hero-overlay">
          <h1>Bridging Hope and Help</h1>
          <p>Help today because tomorrow you may be the one who needs helping!</p>

          {/* Hero Buttons */}
          <div className="">
            

            {/* Real-Time Updates Button */}
            
            <button onClick={() => navigate('/real-time-updates')} className="real-time-updates-btn2">
              <FaSyncAlt className="icon" /> Real-Time Updates
              </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="features-section">
        {/* Heatmaps */}
        <div className="feature">
          <FaMapMarkedAlt className="icon" />
          <h3>Heatmaps</h3>
          <p>Explore disaster heatmaps to understand affected areas.</p>
          <Link to="/heatmaps">Read More</Link>
        </div>

        {/* NGO Resource Info */}
        <div className="feature" onClick={handleResourceAllocationClick}>
          <FaBoxOpen className="icon" />
          <h3>NGO Resource Info</h3>
          <p>Access detailed NGO resource information for better coordination.</p>
          <a href="#">Read More</a>
        </div>

        {/* NGO Coordination */}
        <div className="feature" onClick={handleNgoCoordinationClick}>
          <FaHandsHelping className="icon" />
          <h3>NGO Coordination</h3>
          <p>Coordinate with NGOs for effective disaster management.</p>
          <a href="#">Read More</a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;