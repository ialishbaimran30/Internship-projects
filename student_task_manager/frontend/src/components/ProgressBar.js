import "../styles/progressbar.css";

const STATUS_COLOR = {
  Pending: "var(--accent-coral)",
  "In Progress": "var(--accent-gold)",
  Completed: "var(--accent-green)",
};

function ProgressBar({ percent, status }) {
  return (
    <div className="progress-bar-track">
      <div
        className="progress-bar-fill"
        style={{ width: `${percent}%`, background: STATUS_COLOR[status] || "var(--panel-dark)" }}
      />
      <span className="progress-bar-label">{percent}%</span>
    </div>
  );
}

export default ProgressBar;