import React, { useEffect, useState } from "react";
import { fetchGroupMembers } from "../../FetchApi";

const ManageMembers = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const data = await fetchGroupMembers(groupId);
        setMembers(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setLoading(false);
      }
    };
    getMembers();
  }, [groupId]);

  const handleRemoveMember = (memberId) => {
    // Handle removing a member logic
    console.log("Removing member:", memberId);
  };

  return (
    <div>
      <h3>Manage Members</h3>
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li key={member._id}>
              {member.name} ({member.role})
              <button onClick={() => handleRemoveMember(member._id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageMembers;
