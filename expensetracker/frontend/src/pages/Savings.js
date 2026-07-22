import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Savings.css";

const emptyForm = {
  title: "",
  target_amount: "",
  
};

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const loadGoals = async () => {
    const res = await api.get("/savings/");
    setGoals(res.data.results || res.data);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const saveGoal = async (e) => {
  e.preventDefault();

  try {
    if (editing) {
      await api.put(`/savings/${editing}/`, form);
    } else {
      await api.post("/savings/", form);
    }

    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
    loadGoals();

  } catch (err) {
    console.log(err.response.data);
    alert(JSON.stringify(err.response.data));
  }
};

  const editGoal = (goal) => {
    setEditing(goal.id);

    setForm({
      title: goal.title,
      target_amount: goal.target_amount,
    
    });

    setShowModal(true);
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    await api.delete(`/savings/${id}/`);

    loadGoals();
  };

  const deposit = async (id) => {
    if (!depositAmount) return;

    await api.post(`/savings/${id}/deposit/`, {
      amount: depositAmount,
    });

    setDepositAmount("");
    loadGoals();
  };

  const withdraw = async (id) => {
    if (!depositAmount) return;

    await api.post(`/savings/${id}/withdraw/`, {
      amount: depositAmount,
    });

    setDepositAmount("");
    loadGoals();
  };

  return (
    <div>

      <div className="toolbar">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setShowModal(true);
          }}
        >
          + New Goal
        </button>
      </div>

      <div className="saving-grid">

        {goals.map((goal) => (

          <div className="saving-card glass" key={goal.id}>

            <h3>{goal.title}</h3>

            <p>
              Saved
              <strong>
                {" "}
                Rs {Number(goal.saved_amount).toLocaleString()}
              </strong>
            </p>

            <p>
              Target
              <strong>
                {" "}
                Rs {Number(goal.target_amount).toLocaleString()}
              </strong>
            </p>

            <div className="progress">

              <div
                className="progress-fill"
                style={{
                  width: `${goal.progress_percentage}%`,
                }}
              />

            </div>

            <small>{goal.progress_percentage}% Completed</small>

            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />

            <div className="saving-actions">

              <button
                className="btn btn-primary"
                onClick={() => deposit(goal.id)}
              >
                Deposit
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => withdraw(goal.id)}
              >
                Withdraw
              </button>

            </div>

            <div className="saving-actions">

              <button
                className="btn btn-edit"
                onClick={() => editGoal(goal)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => deleteGoal(goal.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-card">

            <h2>
              {editing ? "Edit Goal" : "Create Goal"}
            </h2>

            <form onSubmit={saveGoal}>

              <input
                name="title"
                placeholder="Goal"
                value={form.title}
                onChange={handleChange}
              />

              <input
                type="number"
                name="target_amount"
                placeholder="Target Amount"
                value={form.target_amount}
                onChange={handleChange}
              />

              
              <div className="saving-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}