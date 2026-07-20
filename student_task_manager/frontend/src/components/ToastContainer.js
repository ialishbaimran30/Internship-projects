import { useEffect, useState } from "react";
import { TOAST_EVENT_NAME } from "../utils/toast";
import "../styles/Toast.css";

let idCounter = 0;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = ++idCounter;
      const { message, type } = e.detail;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener(TOAST_EVENT_NAME, handleToast);
    return () => window.removeEventListener(TOAST_EVENT_NAME, handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;