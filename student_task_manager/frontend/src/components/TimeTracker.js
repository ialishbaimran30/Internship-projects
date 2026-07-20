import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/timetracker.css";

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function TimeTracker({ task, onUpdate }) {
  const running = Boolean(task.timer_started_at);
  const [liveMinutes, setLiveMinutes] = useState(task.elapsed_minutes ?? task.time_spent_minutes ?? 0);

  useEffect(() => {
    setLiveMinutes(task.elapsed_minutes ?? task.time_spent_minutes ?? 0);
  }, [task.elapsed_minutes, task.time_spent_minutes]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setLiveMinutes((prev) => prev + 1 / 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const toggleTimer = (e) => {
    e.stopPropagation();
    const endpoint = running ? "stop_timer" : "start_timer";
    api.post(`/tasks/api/${task.id}/${endpoint}/`).then((res) => {
      if (onUpdate) onUpdate(res.data);
    }).catch(console.log);
  };

  return (
    <div className="time-tracker">
      <button
        type="button"
        className={`timer-btn ${running ? "timer-running" : ""}`}
        onClick={toggleTimer}
        title={running ? "Stop timer" : "Start timer"}
      >
        {running ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <span className={`timer-elapsed ${running ? "timer-elapsed-live" : ""}`}>
        {formatMinutes(liveMinutes)}
      </span>
    </div>
  );
}

export default TimeTracker;