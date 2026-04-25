import axios from "axios";

export const predictPrice = async (data) => {
  const response = await axios.post(
    "https://ml-tiny-project.onrender.com/predict",
    data
  );
  return response.data;
};

