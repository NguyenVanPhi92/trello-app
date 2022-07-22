import axios from 'axios';
import { API_ROOT } from 'utilities/constants';

//UPDATE BOARD
export const updateBoard = async (id, data) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/${id}`, data);
  return request.data;
};

// GET ONE BOARD FULL
export const fetchBoardDetails = async (id) => {
  const request = await axios.get(`${API_ROOT}/v1/boards/${id}`);
  return request.data;
};

// ADD NEW COLUMN
export const createNewColumn = async (data) => {
  const request = await axios.post(`${API_ROOT}/v1/columns`, data);
  return request.data;
};

// UPDATE OR REMOVE COLUMN (REMOVE COLUM TRÊM WEB NHƯNG DỮ LIỆU VẪN CÒN IN DATABASE)
export const updateColumn = async (id, data) => {
  const request = await axios.put(`${API_ROOT}/v1/columns/${id}`, data);
  return request.data;
};

// ADD NEW CARD
export const createNewCard = async (data) => {
  const request = await axios.post(`${API_ROOT}/v1/cards`, data);
  return request.data;
};

// UPDATE OR REMOVE CARD
export const updateCard = async (id, data) => {
  const request = await axios.put(`${API_ROOT}/v1/cards/${id}`, data);
  return request.data;
};
