import React from "react";
import { Link } from "react-router-dom";

const GroupCard = ({ group }) => {
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
