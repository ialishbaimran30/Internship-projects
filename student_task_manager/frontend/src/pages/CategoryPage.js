import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { showToast } from "../utils/toast";
import "../styles/category.css";

function CategoryPage() {
  const [categories, setCategories] = useState([]);

  const loadCategories = () => {
    api.get("/tasks/categories/").then((res) => setCategories(res.data));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = (id) => {
    if (window.confirm("Delete Category?")) {
      api.delete(`/tasks/categories/${id}/`).then(() => {
        loadCategories();
        showToast("Category deleted");
      }).catch(() => {
        showToast("Couldn't delete category", "error");
      });
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
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
      </main>
    </div>
  );
}

export default CategoryPage;