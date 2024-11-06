import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div style={{ textAlign: 'left', padding: '20px' }}>
        {/* Back to Dashboard button */}
        <button
          onClick={() => navigate('/')} // Navigate back to the dashboard
          style={{
            backgroundColor: '#ff5722', // Orange background color
            color: 'white', // White text color
            border: 'none', // No border
            padding: '10px 20px', // Padding for a better look
            cursor: 'pointer', // Pointer cursor on hover
            marginBottom: '10px', // Margin below the button
            marginTop: '20px', // Margin above the button
            borderRadius: '5px', // Slightly rounded corners
            fontSize: '16px', // Increased font size
            transition: 'background-color 0.3s', // Transition for hover effect
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ae5516')} // Darker orange on hover
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff5722')} // Original color on mouse leave
        >
          Back to Dashboard
        </button>
      </div>

      {/* About Page Content */}
      <section className="about-hero">
        <div className="about-overlay">
          <h1>About AidTech Innovators</h1>
          <p>Empowering communities through technology and innovation to respond to disasters and build a safer world.</p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <h2>Our Mission</h2>
          <p>
            At AidTech Innovators, our mission is to provide cutting-edge technological solutions that help communities
            prepare for, respond to, and recover from disasters. We believe that technology can play a vital role in
            saving lives and minimizing the impact of natural and man-made disasters.
          </p>
         
<h2>Get Involved</h2>
          <p>
            Whether you're an NGO looking for better resource management solutions or an individual wanting to volunteer during a disaster, AidTech Innovators is here for you. Join us in making a difference today.
          </p>

          {/* Rest of the content */}
        </div>
      </section>
    </div>
  );
};

export default About;
