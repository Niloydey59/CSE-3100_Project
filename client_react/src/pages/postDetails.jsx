// src/pages/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

import { fetchPostDetails } from "../FetchApi/index";

import "../styling/postDetails/PostDetails.css";

const PostDetails = () => {
  const { postId } = useParams(); // Extract post ID from the URL
  const [post, setPost] = useState(null);

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
    </div>
  );
};

export default PostDetails;
