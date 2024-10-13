import React from 'react';
import './App.css';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceFormPage from './ResourceFormPage';  // Import the new page for the form
import NgoCoordination from './ngocordination';    // Import the NGO Coordination component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Route for Resource Allocation Form */}
          <Route path="/allocate-resource" element={<ResourceFormPage />} />

          {/* Route for NGO Coordination */}
          <Route path="/ngo-coordination" element={<NgoCoordination />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
