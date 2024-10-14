import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import './Dashboard.css'; // Make sure to have appropriate CSS styles

const Dashboard = () => {
  const navigate = useNavigate();

  const handleResourceAllocationClick = () => {
    navigate('/allocate-resource');  // Navigate to the form page
  };

  const handleNgoCoordinationClick = () => {
    navigate('/ngo-coordination');
  };

  return (
    <div className="dashboard" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: '250px', padding: '20px', backgroundColor: '#333', color: 'white' }}>
        <h2>AidTech</h2>
        <ul>
          <li>
            <Link to="/heatmaps" style={{ textDecoration: 'none', color: 'white' }}>
              Heatmaps
            </Link>
          </li>
          <li onClick={handleResourceAllocationClick} style={{ cursor: 'pointer' }}>
            NGO Resource Information
          </li>
          <li onClick={handleNgoCoordinationClick}>NGO Coordination</li>
        </ul>
        {/* Green Button for Real-Time Updates */}
        <button
          onClick={() => navigate('/real-time-updates')} // Direct navigation to the real-time updates page
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px',
            cursor: 'pointer',
            marginTop: '20px',
            width: '100%',
            borderRadius: '5px',
          }}
        >
          Real-Time Updates
        </button>
      </div>

      <div className="content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', overflowY: 'auto' }}>
        <img
          src="/Users/merlinsimoes/Documents/GraingerProject/disasterimage.jpg" // Replace with the actual image URL
          alt="Volunteers assisting in disaster management"
          style={{
            maxWidth: '100%', // Responsive image width
            height: 'auto', // Maintain aspect ratio
            borderRadius: '5px', // Rounded corners for aesthetics
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow for depth
            marginBottom: '20px', // Space between images
          }}
        />
        <img
          src="https://example.com/image2.jpg" // Replace with the actual image URL
          alt="Emergency supplies ready for distribution"
          style={{
            maxWidth: '100%', // Responsive image width
            height: 'auto', // Maintain aspect ratio
            borderRadius: '5px', // Rounded corners for aesthetics
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow for depth
            marginBottom: '20px', // Space between images
          }}
        />
        <img
          src="https://example.com/image3.jpg" // Replace with the actual image URL
          alt="Community members participating in a disaster preparedness drill"
          style={{
            maxWidth: '100%', // Responsive image width
            height: 'auto', // Maintain aspect ratio
            borderRadius: '5px', // Rounded corners for aesthetics
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow for depth
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
