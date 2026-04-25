import axios from "axios";

export const predictPrice = async (data) => {
  const response = await axios.post(
    "https://ml-tiny-project.onrender.com/",
    data
  );
  return response.data;
};

