import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTheme, toggleTheme } from "../utils/theme";
import "../styles/Sidebar.css";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 12l8-8 8 8M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    to: "/categories",
    label: "Categories",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: "/tags",
    label: "Tags",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M11.5 3H5a2 2 0 00-2 2v6.5a2 2 0 00.6 1.4l8.5 8.5a2 2 0 002.8 0l6.1-6.1a2 2 0 000-2.8l-8.5-8.5a2 2 0 00-1-.6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(getTheme() === "dark");

  const handleThemeToggle = () => {
    const next = toggleTheme();
    setDark(next === "dark");
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2.3" fill="currentColor" />
          <circle cx="18" cy="6" r="2.3" fill="currentColor" />
          <circle cx="6" cy="18" r="2.3" fill="currentColor" />
          <circle cx="18" cy="18" r="2.3" fill="currentColor" />
        </svg>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <button
              key={item.to}
              className={`sidebar-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.to)}
              title={item.label}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>

      <button className="sidebar-item sidebar-theme" onClick={handleThemeToggle} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
        {dark ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M20 14.5A8.5 8.5 0 1110 3.5a7 7 0 0010 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <button className="sidebar-item sidebar-logout" onClick={logout} title="Logout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 16l4-4-4-4M20 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </aside>
  );
}

export default Sidebar;