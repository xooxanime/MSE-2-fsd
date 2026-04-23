import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Academic");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Protect route
  useEffect(() => {
    if (!token) nav("/");
    fetchData();
  }, []);

  // 📥 Fetch all grievances
  const fetchData = async () => {
    const res = await axios.get(`${API}/grievances`, {
      headers: { Authorization: token }
    });
    setData(res.data);
  };

  // ➕ Add OR ✏️ Update grievance
  const submit = async () => {
    if (!title) return alert("Title required");

    if (editId) {
      // UPDATE
      await axios.put(`${API}/grievances/${editId}`,
        { title, description: desc, category },
        { headers: { Authorization: token } }
      );
      setEditId(null);
    } else {
      // CREATE
      await axios.post(`${API}/grievances`,
        { title, description: desc, category },
        { headers: { Authorization: token } }
      );
    }

    setTitle("");
    setDesc("");
    fetchData();
  };

  // ❌ Delete
  const del = async (id) => {
    await axios.delete(`${API}/grievances/${id}`, {
      headers: { Authorization: token }
    });
    fetchData();
  };

  // ✏️ Set edit mode
  const edit = (g) => {
    setTitle(g.title);
    setDesc(g.description);
    setCategory(g.category);
    setEditId(g._id);
  };

  // 🔍 Search
  const searchData = async () => {
    const res = await axios.get(
      `${API}/grievances/search?title=${search}`,
      { headers: { Authorization: token } }
    );
    setData(res.data);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <button className="btn-danger" onClick={logout}>
        Logout
      </button>

      {/* 📝 FORM */}
      <h3>{editId ? "Update Grievance" : "Submit Grievance"}</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option>Academic</option>
        <option>Hostel</option>
        <option>Transport</option>
        <option>Other</option>
      </select>

      <button className="btn-success" onClick={submit}>
        {editId ? "Update" : "Submit"}
      </button>

      {/* 🔍 SEARCH */}
      <input
        className="search"
        placeholder="Search grievance..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <button className="btn-primary" onClick={searchData}>
        Search
      </button>

      {/* 📦 DISPLAY */}
      {data.map((g) => (
        <div key={g._id} className="card">
          <h4>{g.title}</h4>
          <p>{g.description}</p>
          <p><b>Category:</b> {g.category}</p>
          <p><b>Status:</b> {g.status}</p>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={() => edit(g)}
            >
              Edit
            </button>

            <button
              className="btn-danger"
              onClick={() => del(g._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}