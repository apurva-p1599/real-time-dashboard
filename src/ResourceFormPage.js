import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ResourceForm from './Form';  // Import the form

const ResourceFormPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  return (
    <div style={{ padding: '20px' }}>
      {/* Back to Dashboard button at the top left */}
      <button
        onClick={() => navigate('/')} // Navigate back to the dashboard
        style={{
          backgroundColor: '#007BFF', // Blue background color
          color: 'white', // White text color
          border: 'none', // No border
          padding: '10px 20px', // Padding for a better look
          cursor: 'pointer', // Pointer cursor on hover
          borderRadius: '5px', // Slightly rounded corners
          fontSize: '16px', // Increased font size
          transition: 'background-color 0.3s', // Transition for hover effect
          position: 'absolute', // Positioning the button
          top: '20px', // Distance from the top
          left: '20px', // Distance from the left
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} // Darker blue on hover
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')} // Original blue on mouse leave
      >
        Back to Dashboard
      </button>

      <h2 style={{ textAlign: 'center', marginTop: '60px' }}>Resource Information Page</h2>
      <ResourceForm />  {/* Display the form */}
    </div>
  );
};

export default ResourceFormPage;
