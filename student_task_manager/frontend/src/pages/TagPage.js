import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { showToast } from "../utils/toast";
import "../styles/category.css";

function TagPage() {
  const [tags, setTags] = useState([]);

  const loadTags = () => {
    api.get("/tasks/tags/").then((res) => setTags(res.data));
  };

  useEffect(() => {
    loadTags();
  }, []);

  const deleteTag = (id) => {
    if (window.confirm("Delete Tag?")) {
      api.delete(`/tasks/tags/${id}/`).then(() => {
        loadTags();
        showToast("Tag deleted");
      }).catch(() => {
        showToast("Couldn't delete tag", "error");
      });
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
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
      </main>
    </div>
  );
}

export default TagPage;