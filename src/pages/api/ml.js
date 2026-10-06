import axios from "axios";

const ML_API_URL =
  "https://lms-backend-g4.onrender.com";

export const getMLRecommendations = async (currentCourseTitle) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${ML_API_URL}/recommend`,
      {
        current_course: currentCourseTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🤖 ML RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ ML ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};