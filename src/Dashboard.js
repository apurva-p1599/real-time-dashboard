// Dashboard.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Dashboard = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const navigate = useNavigate();  // Initialize navigate function

  useEffect(() => {
    // Fetch earthquake data from USGS
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      .then(response => response.json())
      .then(data => {
        setEarthquakes(data.features); // Store earthquake data in state
      })
      .catch(error => console.error('Error fetching earthquake data:', error));
  }, []);

  const handleResourceAllocationClick = () => {
    navigate('/allocate-resource');  // Navigate to the form page
  };

  const handleNgoCoordinationClick =() =>{
    navigate('/ngo-coordination');
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Real-Time Updates</h2>
        <ul>
          <li>Heatmaps</li>
          <li onClick={handleResourceAllocationClick} style={{ cursor: 'pointer' }}>
            Resource Allocation
          </li>
          <li onClick={handleNgoCoordinationClick}>NGO Coordination</li>
        </ul>
        <button className="live-updates-btn">Live Updates</button>
      </div>

      <div className="map-container">
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
    </div>
  );
};

export default Dashboard;
