import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import CategoryModal from "../components/CategoryModal";
import "../styles/category.css";

function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showCategory, setShowCategory] = useState(false);

  const loadCategories = () => {
    api.get("/tasks/categories/").then((res) => setCategories(res.data));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = (id) => {
    if (window.confirm("Delete Category?")) {
      api.delete(`/tasks/categories/${id}/`).then(() => loadCategories());
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="manage-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>&larr; Back</button>
          <button className="btn btn-primary" onClick={() => setShowCategory(true)}>+ Add Category</button>
        </div>

        <h1 className="manage-title">Manage Categories</h1>
        <p className="manage-sub">Organize tasks under categories</p>

        <div className="manage-list">
          {categories.length === 0 ? (
            <div className="glass-panel empty-board"><p>No categories yet</p></div>
          ) : (
            categories.map((cat) => (
              <div className="glass-panel manage-card" key={cat.id}>
                <span>{cat.name}</span>
                <button className="btn btn-danger" onClick={() => deleteCategory(cat.id)}>Delete</button>
              </div>
            ))
          )}
        </div>

        <CategoryModal show={showCategory} onClose={() => setShowCategory(false)} refreshCategories={loadCategories} />
      </main>
    </div>
  );
}

export default CategoryPage;