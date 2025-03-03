import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { useAuth } from "../../context/authcontext";
// Components
import Popup from "../common/popup";
// Styling
import "../../styling/groups/groupHeader.css";
// Api
import { joinGroup, leaveGroup } from "../../FetchApi";

const GroupHeader = ({ group }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  //states
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleJoinGroup = async () => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
    try {
      console.log("Joining group...");
      const groupId = group._id;
      const data = await joinGroup(groupId);
      console.log("Joined group:", data);
    } catch (error) {
      console.error("Failed to join group:", error.message);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      console.log("Leaving group...");
      const groupId = group._id;
      const data = await leaveGroup(groupId);
      console.log("Left group:", data);
    } catch (error) {
      console.error("Failed to leave group:", error.message);
    }
  };

  const handleManageGroup = () => {
    console.log("Managing group...");
    navigate(`/groups/${group._id}/manage`);
  };

  const handleAddPost = () => {
    console.log("Adding post...");
    navigate(`/groups/${group._id}/add-post`);
    // Add logic to show the add post form
  };

  const closePopup = () => {
    setShowLoginPopup(false);
  };

  /* Check if user is a member of the group */
  const isMember =
    currentUser &&
    group.members.some((member) => member.user === currentUser._id);
  /* Check if user is a admin of the group */
  const isAdmin = currentUser && group.admin === currentUser._id;

  /* console.log("Is Member:", isMember);
  console.log("Is Admin:", isAdmin); */

  return (
    <div className="group-header-section">
      {/* Headline */}
      <div className="group-header-details">
        <h1>{group.name}</h1>
        <p>{group.description}</p>
      </div>

      {/* Buttons */}
      {isAdmin ? (
        <button className="btn-manage-group" onClick={handleManageGroup}>
          Manage Group
        </button>
      ) : isMember ? (
        <button className="btn-leave-group" onClick={handleLeaveGroup}>
          Leave Group
        </button>
      ) : (
        <button className="btn-join-group" onClick={handleJoinGroup}>
          Join Group
        </button>
      )}
      {isAdmin || isMember ? (
        <button className="btn-add-post" onClick={handleAddPost}>
          Add Post
        </button>
      ) : null}

      {/* Popup */}
      <Popup
        isVisible={showLoginPopup}
        title="You need to log in"
        message="Login to join the group."
        onClose={closePopup}
      />
    </div>
  );
};

export default GroupHeader;
