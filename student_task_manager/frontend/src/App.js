import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tasks" element={<TaskList />} />

        <Route path="/tasks/add" element={<TaskForm />} />
        <Route path="/tasks/edit/:id" element={<TaskForm />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/tags" element={<TagPage />} />
        <Route path="/register" element={<Register />} />

    

      </Routes>

    </BrowserRouter>
  );
}

export default App;