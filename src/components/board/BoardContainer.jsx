import { useParams } from "react-router-dom";
import React, { useState } from "react";
import Board from "./Board";

function BoardContainer() {
  const { boardId } = useParams(); // obtenemos el ID de la URL
  const [selectedBoardId, setSelectedBoardId] = useState(boardId || null);

  const handleBoardSelect = (boardId) => {
    setSelectedBoardId(boardId);
  };

  return (
    <Board
      boardId={selectedBoardId}
      onBoardSelect={handleBoardSelect}
    />
  );
}

export default BoardContainer;
