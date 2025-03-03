import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// API
import { fetchPostsById, updatePostById } from "../../FetchApi";
// Styling
import "../../styling/forms/updatePost.css";

const UpdatePost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();

  // States
  const [post, setPost] = useState({ title: "", content: "", tags: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await fetchPostsById(id);
        setPost(data.payload.post); // Update state with fetched post data
      } catch (err) {
        setError("Failed to fetch post details.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePostById(id, post); // API call to update post
      navigate(`/post/${id}`); // Navigate to the updated post's details page
    } catch (err) {
      setError("Failed to update post.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) return <p>Loading...</p>;
  // Error state
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="update-post-container">
      {/* Page Headline */}
      <h2>Update Post</h2>

      {/* Update Post Form */}
      <form className="update-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          {/* Tittle */}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          {/* Content */}
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          {/* Tags */}
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags.join(", ")} // Display tags as comma-separated string
            onChange={(e) =>
              setPost((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              }))
            }
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="update-button">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
