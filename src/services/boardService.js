import axios from "axios";

const API_URL = "https://kanban-v1.up.railway.app/api/boards";

export const getBoards = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getBoardById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createBoard = async (boardData) => {
  const response = await axios.post(API_URL, boardData);
  return response.data;
};

export const updateBoard = async (id, boardData) => {
  const response = await axios.put(`${API_URL}/${id}`, boardData);
  return response.data;
};

export const deleteBoard = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
