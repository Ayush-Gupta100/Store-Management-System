import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const RAW_API = import.meta.env.VITE_API || "http://localhost:5000";
const API = RAW_API.endsWith("/api") ? RAW_API : `${RAW_API}/api`;

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function useApi(token) {
  return useMemo(() => {
    const client = axios.create({
      baseURL: API,
      headers: {
        "Content-Type": "application/json",
      },
    });

    client.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return client;
  }, [token]);
}

function AuthInput({ label, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const { login } = useAuth();
  const api = useApi("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/register", form);
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={submit}>
        <h1>Lost and Found</h1>
        <p className="subtitle">Create your student account</p>

        {error && <div className="alert error">{error}</div>}

        <AuthInput
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter full name"
        />
        <AuthInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@college.edu"
        />
        <AuthInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Minimum 6 characters"
        />

        <button disabled={loading} type="submit" className="btn primary">
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="footnote">
          Already registered? <button type="button" className="text-btn" onClick={onSwitch}>Log in</button>
        </p>
      </form>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const api = useApi("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please provide email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/login", form);
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={submit}>
        <h1>Lost and Found</h1>
        <p className="subtitle">Sign in to dashboard</p>

        {error && <div className="alert error">{error}</div>}

        <AuthInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@college.edu"
        />
        <AuthInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Your password"
        />

        <button disabled={loading} type="submit" className="btn primary">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="footnote">
          New user? <button type="button" className="text-btn" onClick={onSwitch}>Create account</button>
        </p>
      </form>
    </div>
  );
}

const initialItemState = {
  itemName: "",
  description: "",
  type: "Lost",
  location: "",
  date: new Date().toISOString().split("T")[0],
  contactInfo: "",
};

function ItemForm({ form, setForm, onSubmit, editing, loading }) {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <h2>{editing ? "Update Item" : "Add Item"}</h2>

      <div className="grid-2">
        <AuthInput
          label="Item Name"
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          placeholder="Wallet, ID Card, Watch"
        />

        <div className="field">
          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>
      </div>

      <AuthInput
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Color, brand, unique marks"
      />

      <div className="grid-2">
        <AuthInput
          label="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Library, C-Block"
        />

        <AuthInput
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <AuthInput
        label="Contact Info"
        value={form.contactInfo}
        onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
        placeholder="Phone or email"
      />

      <button disabled={loading} className="btn primary" type="submit">
        {loading ? "Saving..." : editing ? "Update Item" : "Add Item"}
      </button>
    </form>
  );
}

function Dashboard() {
  const { user, token, logout } = useAuth();
  const api = useApi(token);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialItemState);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("All");
  const [editingId, setEditingId] = useState("");

  const resetForm = () => {
    setEditingId("");
    setForm(initialItemState);
  };

  const getItems = async () => {
    setListLoading(true);
    setError("");
    try {
      const response = await api.get("/items");
      setItems(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unauthorized access.");
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setListLoading(false);
    }
  };

  const searchItems = async () => {
    setListLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.name = search.trim();
      if (searchType !== "All") params.type = searchType;

      if (!params.name && !params.type) {
        await getItems();
        return;
      }

      const response = await api.get("/items/search", { params });
      setItems(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const submitItem = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.itemName || !form.description || !form.type || !form.location || !form.contactInfo) {
      setError("Please fill all item fields.");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/items/${editingId}`, form);
        setMessage("Item updated successfully.");
      } else {
        await api.post("/items", form);
        setMessage("Item added successfully.");
      }
      resetForm();
      await getItems();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save item.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : initialItemState.date,
      contactInfo: item.contactInfo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id) => {
    setError("");
    setMessage("");
    try {
      await api.delete(`/items/${id}`);
      setMessage("Item deleted successfully.");
      await getItems();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete item.");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Lost and Found Dashboard</h1>
          <p>Welcome {user?.name}</p>
        </div>
        <button className="btn danger" onClick={logout}>Logout</button>
      </header>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <ItemForm
        form={form}
        setForm={setForm}
        onSubmit={submitItem}
        editing={Boolean(editingId)}
        loading={loading}
      />

      <section className="card">
        <h2>Search Items</h2>
        <div className="search-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by item name"
          />
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          <button className="btn secondary" onClick={searchItems}>Search</button>
          <button
            className="btn ghost"
            onClick={() => {
              setSearch("");
              setSearchType("All");
              getItems();
            }}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="card">
        <h2>All Reported Items</h2>
        {listLoading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="item-list">
            {items.map((item) => {
              const own = item.user?._id === user?.id;
              return (
                <article key={item._id} className="item-card">
                  <div className="item-head">
                    <h3>{item.itemName}</h3>
                    <span className={`pill ${item.type === "Lost" ? "lost" : "found"}`}>{item.type}</span>
                  </div>
                  <p>{item.description}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                  <p><strong>Contact:</strong> {item.contactInfo}</p>
                  <p><strong>Reported by:</strong> {item.user?.name || "Unknown"}</p>

                  <div className="actions">
                    <button className="btn secondary" onClick={() => startEdit(item)} disabled={!own}>Update</button>
                    <button className="btn danger" onClick={() => deleteItem(item._id)} disabled={!own}>Delete</button>
                  </div>
                  {!own && <small>Only owner can update or delete this entry.</small>}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState("login");

  if (user) return <Dashboard />;

  if (page === "register") {
    return <RegisterForm onSwitch={() => setPage("login")} />;
  }

  return <LoginForm onSwitch={() => setPage("register")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
