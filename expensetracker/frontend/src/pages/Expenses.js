import { useEffect, useState } from "react";
import api from "../api/axios";
import {  PAYMENT_METHODS } from "../config";
import "../styles/Expenses.css";

const emptyForm = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  payment_method: "Cash",
  description: "",
  favorite: false,
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
  const res = await api.get("/categories/");
  setCategories(res.data.results || res.data);
};

  const loadExpenses = async () => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (categoryFilter) params.append("category", categoryFilter);
  params.append("ordering", "-date");
  const res = await api.get(`/expenses/?${params.toString()}`);
  setExpenses(res.data.results || res.data);
};
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (exp) => {
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category || "",
      date: exp.date,
      payment_method: exp.payment_method,
      description: exp.description || "",
      favorite: exp.favorite,
    });
    setEditingId(exp.id);
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddCategory = async () => {
  if (!newCategory.trim()) return;
  const res = await api.post("/categories/", {
    name: newCategory.trim(),
  });
  setCategories([...categories, res.data]);
  setForm({ ...form, category: res.data.id });
  setNewCategory("");
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const payload = {
    ...form,
    category: form.category || null,
  };

  try {
    if (editingId) {
      await api.put(`/expenses/${editingId}/`, payload);
    } else {
      await api.post("/expenses/", payload);
    }

    setShowModal(false);
    loadExpenses();
  } catch (err) {
    const data = err.response?.data;

    setError(
      typeof data === "object"
        ? Object.values(data).flat().join(" ")
        : "Something went wrong."
    );
  }
};

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this expense?")) return;
  await api.delete(`/expenses/${id}/`);
  loadExpenses();
};

  const toggleFavorite = async (exp) => {
  await api.patch(`/expenses/${exp.id}/`, {
    favorite: !exp.favorite,
  });

  loadExpenses();
};

  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-filters">
          <input
            placeholder="Search title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Add expense</button>
      </div>

      <div className="expense-table glass">
        <div className="expense-row header">
          <span>Title</span>
          <span>Category</span>
          <span>Date</span>
          <span>Payment</span>
          <span></span>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">No expenses found.</div>
        ) : (
          expenses.map((exp) => (
            <div className="expense-row" key={exp.id}>
              <div className="expense-title">
                <strong className="mono">Rs {Number(exp.amount).toLocaleString()}</strong>
                <span>{exp.title}</span>
              </div>
              <span className="tag">{exp.category_name || "Uncategorized"}</span>
              <span>{exp.date}</span>
              <span>{exp.payment_method}</span>
              <div className="row-actions">
                <button
                  className={`icon-btn fav ${exp.favorite ? "active" : ""}`}
                  onClick={() => toggleFavorite(exp)}
                  title="Favorite"
                >
                  ★
                </button>
                <button className="icon-btn" onClick={() => openEditModal(exp)} title="Edit">
                  ✎
                </button>
                <button className="icon-btn" onClick={() => handleDelete(exp.id)} title="Delete">
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card glass-strong" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit expense" : "Add expense"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Amount (Rs)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    max={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="category-add-row">
                <input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button type="button" className="btn btn-ghost" onClick={handleAddCategory}>Add</button>
              </div>

              <div className="field">
                <label>Payment method</label>
                <select name="payment_method" value={form.payment_method} onChange={handleChange}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Description (optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange} />
              </div>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="favorite"
                  checked={form.favorite}
                  onChange={handleChange}
                />
                Mark as favorite
              </label>

              {error && <p className="error-text">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Save changes" : "Add expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}