import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Api
import { createGroup } from "../../FetchApi";
// Styling
import "../../styling/forms/CreateGroup.css";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError("Name and description are required.");
      return;
    }

    try {
      const data = await createGroup({ name, description });
      const groupId = data.payload._id;
      navigate(`/groups/${groupId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-group-page">
      {/* Page Headline */}
      <h1>Create a New Group</h1>

      {/* Error Section */}
      {error && <p className="error">{error}</p>}

      {/* Create Group Form */}
      <form onSubmit={handleCreateGroup} className="create-group-form">
        <div className="form-group">
          <label htmlFor="name">Group Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            placeholder="Write a short description of your group"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
