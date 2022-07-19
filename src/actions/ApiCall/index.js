import axios from "axios";
import { API_ROOT } from "utilities/constants";

// GET ONE BOARD FULL
export const fetchBoardDetails = async (id) => {
  //
  const request = await axios.get(`${API_ROOT}/v1/boards/${id}`);

  console.log("API : ", request);
  return request.data;
};