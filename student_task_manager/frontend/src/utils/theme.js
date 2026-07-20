const THEME_KEY = "taskManagerTheme";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
applyTheme(getTheme());