// src/utils/auth.js

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");

  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
    return null;
  }
}

export function isAdmin() {
  const user = getCurrentUser();
  return user?.rol === "admin"; // ✅ Optional chaining
}

export function isCiudadano() {
  const user = getCurrentUser();
  return user?.rol === "ciudadano"; // ✅ Optional chaining
}
