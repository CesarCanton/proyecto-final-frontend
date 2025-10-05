import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Board from "../src/components/board/Board";
import "./App.css";

function App() {
  
  return (
    <>
      <div className="">
        <Board/>
      </div>
    </>
  );
}

export default App;
