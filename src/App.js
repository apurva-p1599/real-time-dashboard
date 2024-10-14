import React from 'react';
import './App.css';
import Dashboard from './Dashboard';
import RealTimeUpdates from './RealTimeUpdates'; // Import the RealTimeUpdates component
import Heatmaps from './Heatmaps'; // Import the Heatmaps component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceFormPage from './ResourceFormPage';  
import NgoCoordination from './ngocordination';    

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/real-time-updates" element={<RealTimeUpdates />} />
          <Route path="/heatmaps" element={<Heatmaps />} /> {/* New Route for Heatmaps */}
          <Route path="/allocate-resource" element={<ResourceFormPage />} />
          <Route path="/ngo-coordination" element={<NgoCoordination />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
