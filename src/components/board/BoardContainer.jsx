import React, { useState } from "react";
import Board from "./Board";


function BoardContainer() {
    const [selectedBoardId, setSelectedBoardId] = useState(null);

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