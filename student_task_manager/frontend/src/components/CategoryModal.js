import { useState } from "react";
import api from "../services/api";
import { showToast } from "../utils/toast";
import "../styles/modal.css";

function CategoryModal({ show, onClose, refreshCategories }) {
  const [name, setName] = useState("");
  if (!show) return null;

  const saveCategory = () => {
    api.post("/tasks/categories/", { name: name }).then(() => {
      setName("");
      if (refreshCategories) refreshCategories();
      showToast("Category created");
      onClose();
    }).catch((err) => {
      console.log(err.response.data);
      console.log(err.response.status);
      showToast("Couldn't create category", "error");
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal glass-panel-strong">
        <h2>Add Category</h2>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-btn">
          <button className="btn btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" onClick={saveCategory}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;