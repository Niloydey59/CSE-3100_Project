import React from "react";
import { Link } from "react-router-dom";

const GroupCard = ({ group, updateGroup }) => {
  const truncate = (str, n) => {
    return str.length > n ? str.substring(0, n) + "..." : str; // Truncate the string if it's longer than n
  };

  return (
    <div className="group-card">
      <h3>{group.name}</h3>
      <p>{group.description}</p>

      <Link to={`/groups/${group._id}`} className="group-card-link">
        View Group
      </Link>
    </div>
  );
};

export default GroupCard;
