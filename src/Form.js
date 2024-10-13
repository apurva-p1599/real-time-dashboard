import React, { useState } from 'react';
import './Form.css'; // Adjust the path as necessary

function ResourceForm() {
  const [formData, setFormData] = useState({
    ngo_name: '',
    resource_type: '',
    quantity: '',
    unit_of_measurement: '',
    location: '',
    allocation_date: '',
    allocated_by: '',
    allocated_to: '',
    purpose: '',
    priority_level: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send data to the backend for database storage
    try {
      console.log(JSON.stringify(formData))
      const response = await fetch('http://localhost:5000/allocate-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Resource allocated successfully!');
        // Clear the form after successful submission
        setFormData({
          ngo_name: '',
          resource_type: '',
          quantity: '',
          unit_of_measurement: '',
          location: '',
          allocation_date: '',
          allocated_by: '',
          allocated_to: '',
          purpose: '',
          priority_level: '',
        });
      } else {
        alert('Failed to allocate resource. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while allocating the resource. Please try again.');
    }
  };

  return (
    <div className="resource-form">
      <h2>Allocate Resource</h2>
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
        <br />
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
        <br />
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
        <br />
        <label>
          Unit of Measurement:
          <input
            type="text"
            name="unit_of_measurement"
            value={formData.unit_of_measurement}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>
        <br />
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
        <br />
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
        <br />
        <label>
          Allocated To:
          <input
            type="text"
            name="allocated_to"
            value={formData.allocated_to}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Purpose:
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Priority Level:
          <select name="priority_level" value={formData.priority_level} onChange={handleChange} required>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <br />
        <button type="submit">Allocate Resource</button>
      </form>
    </div>
  );
}

export default ResourceForm;
