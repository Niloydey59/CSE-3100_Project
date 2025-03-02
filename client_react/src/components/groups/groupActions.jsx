import React from "react";

const GroupActions = ({ isAdmin }) => {
  return (
    <div className="group-actions">
      {isAdmin && <button className="btn btn-edit-group">Edit Group</button>}

      <button className="btn btn-join-group">
        {isAdmin ? "Manage Members" : "Join Group"}
      </button>
    </div>
  );
};

export default GroupActions;
