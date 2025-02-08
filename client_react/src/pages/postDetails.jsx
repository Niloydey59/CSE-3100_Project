// src/pages/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";

// API
import { dislikePost, fetchPostDetails, likePost } from "../FetchApi/index";
// Styling
import "../styling/postDetails/PostDetails.css";
import { useAuth } from "../context/authcontext";
import Comments from "../components/postDetails/comments";

const PostDetails = () => {
  const { postId } = useParams(); // Extract post ID from the URL
  const [post, setPost] = useState(null);

  const { currentUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        const data = await fetchPostDetails(postId); // Fetch post details
        console.log("Data received:", data);
        setPost(data.payload.post);
        console.log("Post details:", post);
      } catch (error) {
        console.error("Failed to load post details:", error);
      }
    };

    loadPostDetails();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  const sliderSettings = {
    dots: post.image.length > 1, // Enable dots only if there are multiple images
    infinite: post.image.length > 1, // Enable infinite scrolling only if there are multiple images
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true, // Enables centering
    centerPadding: "0px", // Removes extra paddin
  };

  const handleLike = async (id) => {
    if (!currentUser) {
      setShowPopup(true); // Show popup if user is not logged in
      return;
    }

    try {
      const data = await likePost(id);
      console.log("Post liked:", data.payload.updatedPost);
      setPost(data.payload.updatedPost);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDislike = async (id) => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    try {
      const data = await dislikePost(id);
      console.log("Post disliked:", data.payload.updatedPost);
      setPost(data.payload.updatedPost); // Update the post in the parent component
    } catch (error) {
      console.error(error.message);
    }
  };

  // close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Check if the currentUser has liked or disliked the post
  const hasLiked = currentUser && post.likes.includes(currentUser._id); // Assuming currentUser has _id
  const hasDisliked = currentUser && post.dislikes.includes(currentUser._id);

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p>By {post.username}</p>
      <p>{post.content}</p>

      {/* Image Carousel */}
      {post.image && post.image.length > 0 && (
        <div className="post-image-carousel">
          <Slider {...sliderSettings}>
            {post.image.map((imgUrl, index) => (
              <div key={index} className="carousel-slide">
                <img src={imgUrl} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Slider>
        </div>
      )}

      <div className="post-stats">
        <span>{post.likes.length} Likes</span>
        <span>{post.comments.length} Comments</span>
      </div>

      <div className="post-tags">
        <strong>Tags:</strong> {post.tags.join(", ")}
      </div>
      {/* Post Actions */}
      <div className="post-actions">
        <span className={`action-button`} onClick={() => handleLike(post._id)}>
          <div className={`like-icon${hasLiked ? "liked" : ""}`}>
            <i className="fa-solid fa-thumbs-up">{post.likes.length}</i>
          </div>
        </span>
        <span
          className={`action-button`}
          onClick={() => handleDislike(post._id)}
        >
          <div className={`like-icon${hasDisliked ? "disliked" : ""}`}>
            <i className="fa-solid fa-thumbs-down">{post.dislikes.length}</i>
          </div>
        </span>
        <span>
          <i class="fa-regular fa-comment"></i>
          {post.comments.length}
        </span>
      </div>

      {/* Comments Section */}
      <Comments comments={post.comments} postId={post._id} />

      {/* {Popup Menu}  */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>You need to log in</h2>
            <p>Login to like or dislike posts.</p>
            <div className="popup-actions">
              <Link to="/login" className="popup-button">
                Login Now
              </Link>
              <button className="popup-button close" onClick={closePopup}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
