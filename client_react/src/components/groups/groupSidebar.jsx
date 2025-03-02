import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styling
import "../../styling/groups/groupSidebar.css";

const GroupSidebar = ({ members }) => {
  const navigate = useNavigate();
  //console.log("Group members:", members);
  //States
  const [visibleMembers, setVisibleMembers] = useState(10); // Default number of members to show

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <i className="fa-solid fa-crown" title="Admin"></i>;
      case "moderator":
        return <i className="fa-solid fa-shield-alt" title="Moderator"></i>;
      case "member":
      default:
        return <i className="fa-solid fa-user" title="Member"></i>;
    }
  };

  const handleShowAll = () => {
    navigate(`/groups/members`); // Navigate to the members details page
  };

  return (
    <div className="group-sidebar">
      <h3>Group Members</h3>
      <ul className="group-members-list">
        {members && members.length > 0 ? (
          members.slice(0, visibleMembers).map((member) => (
            <li key={member._id} className="group-member-item">
              <div className="member-avatar">
                <span>{getRoleIcon(member.role)}</span>
              </div>
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-role">
                  {member.role || "Member"} {/* Optional role */}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p>No members yet.</p>
        )}
      </ul>
      {members && members.length > visibleMembers && (
        <button className="show-all-button" onClick={handleShowAll}>
          Show All Members
        </button>
      )}
    </div>
  );
};

export default GroupSidebar;
