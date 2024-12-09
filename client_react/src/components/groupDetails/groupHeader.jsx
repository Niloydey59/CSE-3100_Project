import React from "react";

const GroupHeader = ({ name, description }) => {
  return (
    <div className="group-header">
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
};

export default GroupHeader;
