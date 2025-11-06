import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios"; // ✅ default import, not { api }

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) nav("/app/dashboard");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const loginUser = async () => {
    if (!form.email || !form.password) return alert("Email and password required");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid response");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      alert("Login successful ✅");
      nav("/app/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        "Invalid email or password";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0a0a0a",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#111",
          padding: 30,
          width: 350,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Login</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          style={inputStyle}
        />
        <button
          onClick={loginUser}
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            border: "none",
            borderRadius: 6,
            background: loading ? "#555" : "#1976d2",
            color: "white",
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p
          style={{
            marginTop: 12,
            fontSize: 14,
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => nav("/auth/register")}
        >
          Create new account
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#1a1a1a",
  color: "white",
};
