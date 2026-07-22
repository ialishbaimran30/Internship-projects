import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Layout.css";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar glass">
      <div className="brand">
        <div className="brand-mark">K</div>
        <span className="brand-name">Khata</span>
      </div>

      <nav className="nav-group">
        <span className="nav-label">Menu</span>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">◆</span> Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">◈</span> Expenses
        </NavLink>
        <NavLink
          to="/budget"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
        
          <span className="nav-icon">◇</span> Budget
        </NavLink>
        <NavLink to="/savings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">◇</span> Savings
        </NavLink>

      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-ghost logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}