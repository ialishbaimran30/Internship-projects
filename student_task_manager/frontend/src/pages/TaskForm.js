import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import CategoryModal from "../components/CategoryModal";
import TagModal from "../components/TagModal";
import Sidebar from "../components/Sidebar";
import "../styles/taskform.css";

const DRAFT_KEY = "taskFormDraft";

function loadDraft() {
  try {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const draft = !id ? loadDraft() : null;

  const [title, setTitle] = useState(draft?.title || "");
  const [description, setDescription] = useState(draft?.description || "");
  const [dueDate, setDueDate] = useState(draft?.dueDate || "");
  const [priority, setPriority] = useState(draft?.priority || "Medium");
  const [status, setStatus] = useState(draft?.status || "Pending");
  const [category, setCategory] = useState(draft?.category || "");
  const [tag, setTag] = useState(draft?.tag || "");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [showTag, setShowTag] = useState(false);

  // Keep the in-progress "Add Task" form saved so it survives navigating
  // to Manage Categories / Manage Tags and coming back.
  useEffect(() => {
    if (id) return; // don't draft while editing an existing task
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ title, description, dueDate, priority, status, category, tag })
    );
  }, [id, title, description, dueDate, priority, status, category, tag]);

  useEffect(() => {
    loadCategories();
    loadTags();
    if (id) {
      api.get(`/tasks/api/${id}/`).then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date);
        setPriority(task.priority);
        setStatus(task.status);
        setCategory(task.category);
        setTag(task.tags[0]);
      });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = { title, description, due_date: dueDate, priority, status, category, tags: [tag] };

    if (id) {
      api.put(`/tasks/api/${id}/`, taskData).then(() => {
        alert("Task Updated");
        navigate("/tasks");
      }).catch(console.log);
    } else {
      api.post("/tasks/api/", taskData).then(() => {
        sessionStorage.removeItem(DRAFT_KEY);
        alert("Task Added");
        navigate("/tasks");
      }).catch(console.log);
    }
  };

  const cancelForm = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    navigate("/tasks");
  };

  const loadCategories = () => {
    api.get("/tasks/categories/").then((res) => {
      setCategories(res.data);
      if (!res.data.some((cat) => cat.id === Number(category))) {
        setCategory("");
      }
    }).catch(console.log);
  };

  const loadTags = () => {
    api.get("/tasks/tags/").then((res) => {
      setTags(res.data);
      if (!res.data.some((t) => t.id === Number(tag))) {
        setTag("");
      }
    }).catch(console.log);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main form-main">
        <div className="glass-panel-strong task-form-card">
          <h1>{id ? "Edit Task" : "Add Task"}</h1>
          <p className="form-sub">{id ? "Update the details below" : "Fill in the details for your new task"}</p>

          <form onSubmit={handleSubmit} className="task-form-grid">
            <label className="field field-full">
              <span>Title</span>
              <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>

            <label className="field field-full">
              <span>Description</span>
              <textarea placeholder="Add more detail..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <label className="field">
              <span>Due date</span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>

            <label className="field">
              <span>Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label className="field">
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label className="field">
              <span>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>

            <label className="field field-full">
              <span>Tag</span>
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="">Select tag</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>

            <div className="form-quick-actions field-full">
              <button type="button" className="btn btn-ghost" onClick={() => setShowCategory(true)}>+ Add Category</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowTag(true)}>+ Add Tag</button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/categories")}>Manage Categories</button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/tags")}>Manage Tags</button>
            </div>

            <div className="form-submit-row field-full">
              <button type="button" className="btn btn-ghost" onClick={cancelForm}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </div>
          </form>

          <CategoryModal show={showCategory} onClose={() => setShowCategory(false)} refreshCategories={loadCategories} />
          <TagModal show={showTag} onClose={() => setShowTag(false)} refreshTags={loadTags} />
        </div>
      </main>
    </div>
  );
}

export default TaskForm;