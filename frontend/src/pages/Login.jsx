import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:10000/api/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      // ✅ FIXED redirect
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn-primary" onClick={submit}>
        Login
      </button>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        New user? <a href="/register">Register</a>
      </p>
    </div>
  );
}