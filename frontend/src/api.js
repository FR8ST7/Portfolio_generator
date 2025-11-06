// src/api.js
export const BASE_URL = "http://localhost:5000";

export async function api(path, method = "GET", body = null, token = null) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  return data;
}
