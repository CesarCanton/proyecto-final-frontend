import { useState, useEffect } from "react";
import * as boardService from "../services/boardService";

export function useBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBoard = async (newBoard) => {
    const data = await boardService.createBoard(newBoard);
    setBoards((prev) => [...prev, data.data]); // data.data porque la API devuelve {status, message, data}
  };

  const updateBoard = async (id, updatedBoard) => {
    await boardService.updateBoard(id, updatedBoard);
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBoard } : b))
    );
  };

  const removeBoard = async (id) => {
    await boardService.deleteBoard(id);
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return { boards, loading, addBoard, updateBoard, removeBoard };
}
