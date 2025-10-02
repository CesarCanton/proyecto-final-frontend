import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import Board from "../src/components/board/Board";

function App() {
  
  return (
    <>
      <div className="container w-100">
        <Board/>
      </div>
    </>
  );
}

export default App;
