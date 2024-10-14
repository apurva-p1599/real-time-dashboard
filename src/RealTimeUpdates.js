import { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard'; // Ensure ArticleCard is in the correct folder
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const RealTimeUpdates = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const handleGetRealTimeUpdates = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/real-time-data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    handleGetRealTimeUpdates(); // Fetch updates on component mount
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Back to Dashboard button at the top with styling */}
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#007BFF', // Blue background color
          color: 'white', // White text color
          border: 'none', // No border
          padding: '10px 20px', // Padding for a better look
          cursor: 'pointer', // Pointer cursor on hover
          marginTop: '10px', // Margin above the button
          marginBottom: '20px', // Margin below the button
          borderRadius: '5px', // Slightly rounded corners
          fontSize: '16px', // Increased font size
          transition: 'background-color 0.3s', // Transition for hover effect
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} // Darker blue on hover
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')} // Original blue on mouse leave
      >
        Back to Dashboard
      </button>
      
      {loading && <p>Loading real-time updates...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && data.articles && data.articles.length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {data.articles.map((article, index) => (
      <ArticleCard key={index} article={article} />
    ))}
  </div>
)}
    </div>
  );
};

export default RealTimeUpdates;
