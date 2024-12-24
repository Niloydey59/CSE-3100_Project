import api from "./base";

// send verification email
export const sendVerificationEmail = async () => {
  try {
    const response = await api.post("/users/send-verification-email");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Update Password
export const updatePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  try {
    const response = await api.post("/users/update-password", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Verify Email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post("/users/verify", { token });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
