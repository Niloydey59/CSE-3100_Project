import React from "react";
import GroupCard from "./groupsCard";

const GroupList = ({ groups }) => {
  return (
    <div className="group-list">
      {groups.length > 0 ? (
        groups.map((group) => <GroupCard key={group._id} group={group} />)
      ) : (
        <p>No groups available. Be the first to create one!</p>
      )}
    </div>
  );
};

export default GroupList;
