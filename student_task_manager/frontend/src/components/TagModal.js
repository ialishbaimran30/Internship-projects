import { useState } from "react";
import api from "../services/api";
import { showToast } from "../utils/toast";
import "../styles/modal.css";

function TagModal({ show, onClose, refreshTags }) {
  const [name, setName] = useState("");
  if (!show) return null;

  const saveTag = () => {
    api.post("/tasks/tags/", { name: name }).then(() => {
      setName("");
      if (refreshTags) refreshTags();
      showToast("Tag created");
      onClose();
    }).catch((err) => {
      console.log(err.response.data);
      console.log(err.response.status);
      showToast("Couldn't create tag", "error");
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal glass-panel-strong">
        <h2>Add Tag</h2>
        <input
          type="text"
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-btn">
          <button className="btn btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" onClick={saveTag}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default TagModal;