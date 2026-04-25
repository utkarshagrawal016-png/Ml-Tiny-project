import axios from "axios";

export const predictPrice = async (data) => {
  try {
    const response = await axios.post(
      "https://ml-tiny-project.onrender.com/predict",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw error;
  }
};