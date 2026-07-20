import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import TimeTracker from "../components/TimeTracker";
import { isToday, isUpcoming, formatFriendlyDate, statusProgress } from "../utils/schedule";
import { useTaskReminders } from "../utils/useTaskReminders";
import "../styles/dashboard.css";

function ProgressRing({ percent, size = 64 }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(34,31,43,0.1)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="var(--panel-dark)" strokeWidth={stroke} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="53%" textAnchor="middle" className="ring-label">{percent}%</text>
    </svg>
  );
}

const PRIORITY_COLOR = {
  High: "var(--accent-coral)",
  Medium: "var(--accent-gold)",
  Low: "var(--accent-blue)",
};

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const username = localStorage.getItem("username") || "there";

  useEffect(() => {
    api.get("/tasks/api/").then((res) => setTasks(res.data)).catch(console.log);
    api.get("/tasks/categories/").then((res) => setCategories(res.data)).catch(console.log);
  }, []);

  useTaskReminders(tasks);

  const updateTask = (updated) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
  };

  const pending = tasks.filter((t) => t.status === "Pending");
  const completed = tasks.filter((t) => t.status === "Completed");
  const completionRate = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  const todayTasks = tasks.filter((t) => isToday(t.due_date));
  const upcomingTasks = tasks
    .filter((t) => isUpcoming(t.due_date))
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main dash-main">
        <div className="dash-topbar">
          <h1>Dashboard</h1>
          <button className="btn btn-primary" onClick={() => navigate("/tasks/add")}>+ Add Task</button>
        </div>
        <p className="dash-welcome">Welcome back, {username}</p>

        <div className="dash-grid">
          <section className="glass-panel dash-card">
            <div className="dash-card-head">
              <h3>Categories</h3>
              <button className="link-btn" onClick={() => navigate("/categories")}>Manage</button>
            </div>
            {categories.length === 0 ? (
              <p className="empty-note">No categories yet</p>
            ) : (
              <ul className="simple-list">
                {categories.slice(0, 5).map((c) => <li key={c.id}>{c.name}</li>)}
              </ul>
            )}
          </section>

          <section className="glass-panel-strong dash-card dash-overview">
            <h3>This week</h3>
            <div className="overview-stats">
              <div><span className="stat-num">{tasks.length}</span><span className="stat-label">Total tasks</span></div>
              <div><span className="stat-num">{pending.length}</span><span className="stat-label">Pending</span></div>
              <div><span className="stat-num">{completed.length}</span><span className="stat-label">Completed</span></div>
            </div>
            <div className="overview-ring">
              <ProgressRing percent={completionRate} size={64} />
              <span className="overview-ring-caption">Completion rate</span>
            </div>
          </section>

          <section className="glass-panel dash-card">
            <div className="dash-card-head">
              <h3>Tags</h3>
              <button className="link-btn" onClick={() => navigate("/tags")}>Manage</button>
            </div>
            <p className="empty-note">Organize tasks with custom tags</p>
          </section>
        </div>

        <div className="dash-schedule-grid">
          <section className="glass-panel-strong dash-card schedule-card">
            <div className="dash-card-head">
              <h3>Today's Schedule</h3>
              <span className="schedule-date">{formatFriendlyDate(new Date().toISOString())}</span>
            </div>
            {todayTasks.length === 0 ? (
              <p className="empty-note">Nothing due today 🎉</p>
            ) : (
              <div className="schedule-list">
                {todayTasks.map((task) => (
                  <div className="schedule-row" key={task.id} onClick={() => navigate(`/tasks/edit/${task.id}`)}>
                    <span className="chip" style={{ background: PRIORITY_COLOR[task.priority] || "var(--accent-blue)" }}>
                      {task.priority}
                    </span>
                    <span className="schedule-title">{task.title}</span>
                    <span className="schedule-status">{task.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="glass-panel-strong dash-card schedule-card">
            <div className="dash-card-head">
              <h3>Upcoming Schedule</h3>
              <span className="schedule-date">Next 7 days</span>
            </div>
            {upcomingTasks.length === 0 ? (
              <p className="empty-note">Nothing coming up this week</p>
            ) : (
              <div className="schedule-list">
                {upcomingTasks.slice(0, 6).map((task) => (
                  <div className="schedule-row" key={task.id} onClick={() => navigate(`/tasks/edit/${task.id}`)}>
                    <span className="chip" style={{ background: PRIORITY_COLOR[task.priority] || "var(--accent-blue)" }}>
                      {task.priority}
                    </span>
                    <span className="schedule-title">{task.title}</span>
                    <span className="schedule-due">{formatFriendlyDate(task.due_date)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="glass-panel-strong dash-tasks">
          <div className="dash-card-head">
            <h3>All tasks &amp; progress</h3>
            <button className="link-btn" onClick={() => navigate("/tasks")}>Go to task board →</button>
          </div>

          {tasks.length === 0 ? (
            <p className="empty-note">No tasks yet — add your first one.</p>
          ) : (
            <div className="progress-task-list">
              {tasks.map((task) => (
                <div className="progress-task-row" key={task.id}>
                  <div className="progress-task-main" onClick={() => navigate(`/tasks/edit/${task.id}`)}>
                    <span className="chip" style={{ background: PRIORITY_COLOR[task.priority] || "var(--accent-blue)" }}>
                      {task.priority}
                    </span>
                    <span className="progress-task-title">{task.title}</span>
                    <span className="progress-task-status">{task.status}</span>
                  </div>
                  <div className="progress-task-bar">
                    <ProgressBar percent={task.progress ?? statusProgress(task.status)} status={task.status} />
                  </div>
                  <TimeTracker task={task} onUpdate={updateTask} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;