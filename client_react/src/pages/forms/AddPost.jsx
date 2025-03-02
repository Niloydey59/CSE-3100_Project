import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Context
import { useAuth } from "../../context/authcontext";
// API
import { createPost } from "../../FetchApi";
// Styling
import "../../styling/forms/createPost.css";

const AddPostPage = () => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const { groupId } = useParams(); // Get groupId from URL if it exists
  const { intialTitle } = useParams(); // Get initial title from URL if it exists
  /* console.log("Group ID:", groupId);
  console.log("add-post page");
  console.log("Initial Title:", intialTitle); */

  const [title, setTitle] = useState(intialTitle || "");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files); // Update the images state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // Add tags as an array
      tags
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => formData.append("tags[]", tag));

      // Append images
      images.forEach((image) => formData.append("image", image));

      // Include groupId if it exists
      if (groupId) {
        formData.append("groupId", groupId);
      }

      const response = await createPost(formData); // API call
      if (response.success) {
        alert("Post created successfully!");
        setTitle("");
        setContent("");
        setTags("");
        setImages([]);
        navigate(groupId ? `/groups/${groupId}` : "/"); // Navigate to group or home
      } else {
        setError("Failed to create a post.");
      }
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while creating the post.");
    }
  };

  return (
    <div className="add-post-page">
      {/* Page Headline */}
      <h2>{groupId ? "Add a Post to the Group" : "Create a Post"}</h2>

      {/* Error section */}
      {error && <div className="form-error">{error}</div>}

      {/* Post Form */}
      <form className="add-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
            rows="6"
          ></textarea>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="form-input file-input"
          />
        </div>

        <button type="submit" className="submit-button">
          {groupId ? "Add Group Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPostPage;
