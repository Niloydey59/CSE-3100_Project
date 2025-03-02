import { useState } from "react";

// API
import { updateGroup } from "../../FetchApi";

const GroupSettings = ({ groupId }) => {
  //States
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleSaveSettings = async () => {
    // Save group settings logic
    const updateData = { groupName, groupDescription };
    const data = await updateGroup(groupId, updateData);
    console.log("Saving settings for group:", groupId);
    console.log("Name:", groupName, "Description:", groupDescription);
  };

  return (
    <div>
      <h3>Group Settings</h3>
      <div>
        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Group Description:
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default GroupSettings;
