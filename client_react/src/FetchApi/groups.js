import api from "./base";

// Create a new group API call
export const createGroup = async ({ name, description }) => {
  try {
    const response = await api.post("/groups", { name, description });
    console.log("Group created:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Get all groups API call
export const fetchGroups = async ({ search = "", limit = 6, page = 1 }) => {
  try {
    console.log("Search:", search);
    console.log("Limit:", limit);
    console.log("Page:", page);
    const response = await api.get("/groups", {
      params: { search, limit, page },
    });
    console.log("Groups:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
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

// join a group
export const joinGroup = async (groupId) => {
  try {
    const response = await api.post(`/groups/join/${groupId}/`);
    console.log("Joined group:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// leave a group
export const leaveGroup = async (groupId) => {
  try {
    const response = await api.post(`/groups/leave/${groupId}/`);
    console.log("Left group:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// get group posts
export const fetchGroupPosts = async ({
  groupId,
  search = "",
  limit = 5,
  page = 1,
}) => {
  try {
    console.log("Group ID:", groupId);
    console.log("Search:", search);
    console.log("Limit:", limit);
    console.log("Page:", page);
    const response = await api.get(`/groups/posts/${groupId}`, {
      params: { search, limit, page },
    });
    console.log("Group posts:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// get group members
export const fetchGroupMembers = async (groupId) => {
  try {
    console.log("Group ID:", groupId);
    const response = await api.get(`/groups/members/${groupId}`);
    console.log("Group members:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// update group
export const updateGroup = async ({ groupId, updateData }) => {
  try {
    const response = await api.put(`/groups/${groupId}`, updateData);
    console.log("Group updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
