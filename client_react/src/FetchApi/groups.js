import api from "./base";

// Get all groups API call
export const fetchGroups = async () => {
  try {
    const response = await api.get("/groups");
    console.log("Groups:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Get details of a single group by ID
export const fetchGroupDetails = async (groupId) => {
  try {
    console.log("Group ID:", groupId);
    const response = await api.get(`/groups/${groupId}`);
    console.log("Group details:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
