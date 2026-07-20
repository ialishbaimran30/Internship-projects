import { useEffect } from "react";
import { isToday } from "./schedule";

const NOTIFIED_KEY = "taskManagerLastNotifiedDate";

export function useTaskReminders(tasks) {
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    if (!("Notification" in window)) return;

    const todayKey = new Date().toDateString();
    if (localStorage.getItem(NOTIFIED_KEY) === todayKey) return;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const dueToday = tasks.filter((t) => t.status !== "Completed" && isToday(t.due_date));
    const overdue = tasks.filter(
      (t) => t.status !== "Completed" && t.due_date && new Date(t.due_date) < startOfToday
    );

    if (dueToday.length === 0 && overdue.length === 0) return;

    const fireNotification = () => {
      const parts = [];
      if (dueToday.length) parts.push(`${dueToday.length} task${dueToday.length > 1 ? "s" : ""} due today`);
      if (overdue.length) parts.push(`${overdue.length} overdue`);

      new Notification("Task Manager", { body: parts.join(" · ") });
      localStorage.setItem(NOTIFIED_KEY, todayKey);
    };

    if (Notification.permission === "granted") {
      fireNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") fireNotification();
      });
    }
  }, [tasks]);
}