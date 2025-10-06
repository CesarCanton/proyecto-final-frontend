import axios from "axios";
import api from "./api"
const API_URL = "https://kanban-v1.up.railway.app/api/";

export const getColumns = async (boardId) => {
    const response = await axios.get(`${API_URL}/${boardId}/columns`);
    return response.data;
};

export const createColumn = async (columnData) => {
    const response = await axios.post(`${API_URL}/`, columnData);
    return response.data;
};

export const updateColumn = async (columnId, updates) => {
    const response = await axios.put(`${API_URL}/${columnId}`, updates);
    return response.data;
};

export const deleteColumn = async (columnId) => {
    const response = await axios.delete(`${API_URL}/${columnId}`);
    return response.data;
};

