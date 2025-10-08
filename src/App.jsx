import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import BoardContainer from './components/board/BoardContainer';
import TasksPage from './components/tasks/TasksPage'; // tu vista de tabla
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Vista principal del tablero */}
        <Route path="/board/:boardId" element={<BoardContainer />} />

        {/* Vista de tabla de tareas */}
        <Route path="/tasks/:boardId" element={<TasksPage />} />
      </Routes>
    </Router>
  );
}

export default App;

