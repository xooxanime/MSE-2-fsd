import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Protect route
  useEffect(() => {
    if (!token) navigate("/");
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:10000/api/grievances",
      {
        headers: { Authorization: token },
      }
    );
    setGrievances(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addGrievance = async () => {
    if (!title) return alert("Enter title");

    await axios.post(
      "http://localhost:10000/api/grievances",
      {
        title,
        description: "Sample description",
        category: "Academic",
      },
      {
        headers: { Authorization: token },
      }
    );

    setTitle("");
    fetchData();
  };

  const deleteGrievance = async (id) => {
    await axios.delete(
      `http://localhost:10000/api/grievances/${id}`,
      {
        headers: { Authorization: token },
      }
    );
    fetchData();
  };

  const searchGrievances = async () => {
    const res = await axios.get(
      `http://localhost:10000/api/grievances/search?title=${search}`,
      {
        headers: { Authorization: token },
      }
    );
    setGrievances(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <button className="btn-danger" onClick={logout}>
        Logout
      </button>

      {/* ADD */}
      <input
        placeholder="Enter grievance title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn-success" onClick={addGrievance}>
        Add Grievance
      </button>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search grievance..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="btn-primary" onClick={searchGrievances}>
        Search
      </button>

      {/* LIST */}
      {grievances.map((g) => (
        <div className="card" key={g._id}>
          <h4>{g.title}</h4>
          <p>{g.description}</p>

          <div className="actions">
            <button
              className="btn-danger"
              onClick={() => deleteGrievance(g._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}