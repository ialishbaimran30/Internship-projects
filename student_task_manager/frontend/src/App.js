import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";
import NoteList from "./pages/NoteList";
import NoteForm from "./pages/NoteForm";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tasks" element={<TaskList />} />

        <Route path="/tasks/add" element={<TaskForm />} />

        <Route path="/notes" element={<NoteList />} />

        <Route path="/notes/add" element={<NoteForm />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;