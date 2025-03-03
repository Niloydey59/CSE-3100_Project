import { useEffect, useState } from "react";
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
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle tag input
  const handleTagInput = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tagArray.includes(newTag)) {
        setTagArray([...tagArray, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTagArray(tagArray.filter((_, index) => index !== indexToRemove));
  };

  // Handle image selection with preview
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    setImages((prevImages) => [...prevImages, ...newFiles]);

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
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

      // Create final tags array including any remaining tag input
      let finalTags = [...tagArray];
      if (tagInput.trim()) {
        finalTags.push(tagInput.trim());
      }

      // Add tags to formData
      if (finalTags.length > 0) {
        finalTags.forEach((tag) => formData.append("tags[]", tag));
      }
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
        setTagArray([]);
        setTagInput("");
        setImages([]);
        setImagePreviews([]);
        navigate(groupId ? `/groups/${groupId}` : "/"); // Navigate to group or home
      } else {
        setError("Failed to create a post.");
      }
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while creating the post.");
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="add-post-page">
      <h2>{groupId ? "Add a Post to the Group" : "Create a Post"}</h2>

      {error && (
        <div className="form-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      <form className="add-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
            rows="6"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="Add tags (press comma to add)"
            value={tagInput}
            onChange={handleTagInput}
            className="form-input"
          />
          <div className="selected-tags">
            {tagArray.map((tag, index) => (
              <span key={index} className="tag-pill">
                #{tag}
                <i
                  className="fa-solid fa-xmark"
                  onClick={() => removeTag(index)}
                ></i>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images">Images</label>
          <div className="file-input-wrapper">
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="form-input file-input"
            />
            <div className="file-input-placeholder">
              {images.length > 0
                ? `${images.length} image${
                    images.length > 1 ? "s" : ""
                  } selected`
                : "Choose images..."}
            </div>
          </div>
          {imagePreviews.length > 0 && (
            <div className="file-preview">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="preview-image">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!title || !content}
        >
          {groupId ? "Add Group Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPostPage;
