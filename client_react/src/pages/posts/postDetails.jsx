// src/pages/PostDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

// Context
import { useAuth } from "../../context/authcontext";
// Components
import Comments from "../../components/posts/comments";
import Popup from "../../components/common/popup";
// API
import { dislikePost, fetchPostDetails, likePost } from "../../FetchApi/index";
// Styling
import "../../styling/posts/postDetails.css";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const { currentUser } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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

  // custom arrow components for the slider
  const PrevArrow = (props) => {
    const { className, onClick, currentSlide } = props;
    return (
      <>
        {currentSlide !== 0 && (
          <div
            className={`${className} custom-arrow prev-arrow`}
            onClick={onClick}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </div>
        )}
      </>
    );
  };

  const NextArrow = (props) => {
    const { className, onClick, slideCount, currentSlide } = props;
    return (
      <>
        {currentSlide !== slideCount - 1 && (
          <div
            className={`${className} custom-arrow next-arrow`}
            onClick={onClick}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        )}
      </>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: false, // Changed to false to prevent circular scrolling
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: false, // Changed to false
    centerPadding: "0px",
    dotsClass: "slick-dots custom-dots", // Add custom dots class
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  const handleLike = async (id) => {
    if (!currentUser) {
      setShowLoginPopup(true); // Show popup if user is not logged in
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
      setShowLoginPopup(true);
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
    setShowLoginPopup(false);
  };

  // Check if the currentUser has liked or disliked the post
  const hasLiked = currentUser && post.likes.includes(currentUser._id);
  const hasDisliked = currentUser && post.dislikes.includes(currentUser._id);

  return (
    <div className="post-details">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <div className="author-info">
            <div className="author-avatar">
              {post.author.photoURL ? (
                <img src={post.author.photoURL} alt={post.author} />
              ) : (
                <i className="fa-solid fa-user-circle"></i>
              )}
            </div>
            <span>{post.username}</span>
          </div>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="post-content">{post.content}</div>

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

      <div className="post-info">
        <div className="post-actions">
          {/* Likes */}
          <span
            className={`action-button`}
            onClick={() => handleLike(post._id)}
          >
            <div className={`like-icon${hasLiked ? "liked" : ""}`}>
              <i className="fa-solid fa-thumbs-up"> {post.likes.length}</i>
            </div>
          </span>
          {/* Dislikes */}
          <span
            className={`action-button`}
            onClick={() => handleDislike(post._id)}
          >
            <div className={`like-icon${hasDisliked ? "disliked" : ""}`}>
              <i className="fa-solid fa-thumbs-down"> {post.dislikes.length}</i>
            </div>
          </span>
          {/* Comments */}
          <span className="action-button">
            <i className="fa-regular fa-comment"></i> {post.comments.length}
          </span>
          {/* Share Button */}
          <button className="action-button">
            <i className="fa-solid fa-share"></i>
            <span>Share</span>
          </button>
        </div>
      </div>

      <Comments postId={post._id} />

      <Popup
        isVisible={showLoginPopup}
        title="You need to log in"
        message="Login to interact with posts"
        onClose={closePopup}
      />
    </div>
  );
};

export default PostDetails;
