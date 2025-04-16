import api from "./base";

// Fetch all verification requests (admin only)
export const fetchVerificationRequests = async () => {
  try {
    const response = await api.get("/admin/verification-requests");
    return response.data;
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch verification requests",
    };
  }
};

// Handle verification approval/rejection (admin only)
export const handleVerification = async ({ userId, field, status }) => {
  try {
    const response = await api.post("/admin/handle-verification", {
      userId,
      field,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error handling verification:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to process verification",
    };
  }
};
