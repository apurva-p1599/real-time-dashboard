import React, { useState } from 'react';
import './Form.css';

function ResourceForm() {
  const [formData, setFormData] = useState({
    ngo_name: '',
    resource_type: '',
    quantity: '',
    resource_details: '',
    location: '',
    allocation_date: '',
    allocated_by: '',
    age_group: '',
    purpose: '',
    priority_level: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const disaster_id = "disaster001"; // Replace with actual disaster ID for validation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ngo_name || !formData.resource_type || !formData.quantity || !formData.resource_details || !formData.location || !formData.allocation_date || !formData.allocated_by || !formData.age_group || !formData.purpose || !formData.priority_level) {
      setErrorMessage('Please fill in all fields before submitting.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/allocate-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Resource allocated successfully!');
        setFormData({
          ngo_name: '',
          resource_type: '',
          quantity: '',
          resource_details: '',
          location: '',
          allocation_date: '',
          allocated_by: '',
          age_group: '',
          purpose: '',
          priority_level: '',
        });
      } else {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message || 'Failed to allocate resource. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while allocating the resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
                setFormData((prevData) => ({
                    ...prevData,
                    location: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`,
                }));
                console.log("Latitude:", latitude, "Longitude:", longitude);
                setLocationLoading(false);
                setErrorMessage('');
            },
            (error) => {
                setLocationLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMessage("Location access was denied. Please allow location access in your browser settings.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrorMessage("Location information is unavailable. Try again or check device settings.");
                        break;
                    case error.TIMEOUT:
                        setErrorMessage("The request to get your location timed out. Please try again.");
                        break;
                    default:
                        setErrorMessage("An unknown error occurred while fetching location.");
                        break;
                }
            }
        );
    } else {
        setErrorMessage("Geolocation is not supported by this browser.");
    }
};

async function checkArrival(latitude, longitude, disaster_id, ngo_name) {
  // Check if all required parameters are provided
  if (!latitude || !longitude || !disaster_id || !ngo_name) {
      alert("All fields (latitude, longitude, disaster ID, and NGO name) are required.");
      console.error("Missing parameters:", { latitude, longitude, disaster_id, ngo_name });
      return;
  }

  try {
      const response = await fetch("http://127.0.0.1:5000/check-arrival", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude, disaster_id, ngo_name })
      });

      // Check if the response was successful
      if (!response.ok) {
          let errorDetails;
          try {
              errorDetails = await response.json();
          } catch (parseError) {
              console.error("Error parsing error response:", parseError);
              alert("Server error occurred, but the response could not be parsed.");
              return;
          }
          console.error("Server responded with an error:", errorDetails);
          alert(`Server Error: ${errorDetails.error || "An unknown error occurred"}`);
          return;
      }

      const result = await response.json();

      // Check for 'arrivalConfirmed' key in the result
      if (result.arrivalConfirmed !== undefined) {
          alert(result.message);
      } else {
          console.warn("Unexpected response format:", result);
          alert("Unexpected response from server. Please try again.");
      }
  } catch (error) {
      console.error("Network or fetch error:", error);
      alert("An error occurred while checking the arrival. Please check your connection and try again.");
  }
}

  const handleCheckArrival = () => {
    if (!formData.ngo_name) {
        alert("Please enter the NGO Name.");
        return;
    }
    if (latitude && longitude) {
        checkArrival(latitude, longitude, disaster_id, formData.ngo_name);
    } else {
        alert("Please use the 'Locate Me' button to capture your location first.");
    }
};

  return (
    <div className="form-page-background">
      <div className="resource-form">
        <h2>Allocate Resource</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            NGO Name:
            <input
              type="text"
              name="ngo_name"
              value={formData.ngo_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Resource Type:
            <select name="resource_type" value={formData.resource_type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Equipment">Equipment</option>
              <option value="Personnel">Personnel</option>
              <option value="Financial">Financial</option>
              <option value="Supplies">Supplies</option>
            </select>
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
          Resource Details:
            <input
              type="text"
              name="resource_details"
              value={formData.resource_details}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={handleLocateMe}
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
              disabled={locationLoading}
            >
              {locationLoading ? "Locating..." : "Locate Me"}
            </button>
            <button
              type="button"
              onClick={handleCheckArrival}
              style={{
                backgroundColor: "#FF5733",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
                marginLeft: "10px"
              }}
            >
              Check Arrival
            </button>
          </label>
          <label>
            Allocation Date:
            <input
              type="date"
              name="allocation_date"
              value={formData.allocation_date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Allocated By:
            <input
              type="text"
              name="allocated_by"
              value={formData.allocated_by}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Age Group:
            <input
              type="text"
              name="age_group"
              value={formData.age_group}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Purpose:
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Priority Level:
            <select name="priority_level" value={formData.priority_level} onChange={handleChange} required>
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Allocating...' : 'Allocate Resource'}</button>
        </form>
      </div>
    </div>
  );
}

export default ResourceForm;
