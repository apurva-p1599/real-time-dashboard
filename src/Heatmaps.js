import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Heatmaps = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch earthquake data from USGS
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      .then(response => response.json())
      .then(data => {
        setEarthquakes(data.features); // Store earthquake data in state
      })
      .catch(error => console.error('Error fetching earthquake data:', error));
  }, []);

  return (
    <div className="heatmaps-page">
      <div style={{ textAlign: 'left', padding: '20px' }}>
        {/* Back to Dashboard button */}
        <button
          onClick={() => navigate('/')} // Navigate back to the dashboard
          style={{
            backgroundColor: '#007BFF', // Blue background color
            color: 'white', // White text color
            border: 'none', // No border
            padding: '10px 20px', // Padding for a better look
            cursor: 'pointer', // Pointer cursor on hover
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
      </div>

      <MapContainer center={[20, 0]} zoom={2} style={{ height: "90vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {earthquakes.map((quake, index) => {
          const { geometry, properties } = quake;
          const position = [geometry.coordinates[1], geometry.coordinates[0]]; // [latitude, longitude]

          return (
            <Marker key={index} position={position}>
              <Popup>
                <div>
                  <strong>Magnitude:</strong> {properties.mag} <br />
                  <strong>Location:</strong> {properties.place} <br />
                  <strong>Time:</strong> {new Date(properties.time).toLocaleString()}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Heatmaps;
