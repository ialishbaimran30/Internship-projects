import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import TagModal from "../components/TagModal";
import "../styles/category.css";

function TagPage() {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [showTag, setShowTag] = useState(false);

  const loadTags = () => {
    api.get("/tasks/tags/").then((res) => setTags(res.data));
  };

  useEffect(() => {
    loadTags();
  }, []);

  const deleteTag = (id) => {
    if (window.confirm("Delete Tag?")) {
      api.delete(`/tasks/tags/${id}/`).then(() => loadTags());
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="manage-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>&larr; Back</button>
          <button className="btn btn-primary" onClick={() => setShowTag(true)}>+ Add Tag</button>
        </div>

        <h1 className="manage-title">Manage Tags</h1>
        <p className="manage-sub">Keep your tags tidy and relevant</p>

        <div className="manage-list">
          {tags.length === 0 ? (
            <div className="glass-panel empty-board"><p>No tags yet</p></div>
          ) : (
            tags.map((tag) => (
              <div className="glass-panel manage-card" key={tag.id}>
                <span>{tag.name}</span>
                <button className="btn btn-danger" onClick={() => deleteTag(tag.id)}>Delete</button>
              </div>
            ))
          )}
        </div>

        <TagModal show={showTag} onClose={() => setShowTag(false)} refreshTags={loadTags} />
      </main>
    </div>
  );
}

export default TagPage;