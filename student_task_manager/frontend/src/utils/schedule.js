export function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isUpcoming(dateStr, daysAhead = 7) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diffDays = (d - today) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= daysAhead;
}

export function formatFriendlyDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export const STATUS_PROGRESS = { Pending: 0, "In Progress": 50, Completed: 100 };

export function statusProgress(status) {
  return STATUS_PROGRESS[status] ?? 0;
}