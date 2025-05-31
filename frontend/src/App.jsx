import { useEffect, useState } from "react";
import axios from "axios";

import MapPanel from "./components/MapPanel/MapPanel";
import StatsPanel from "./components/StatsPanel/StatsPanel";


// Environment Variables
const API = import.meta.env.VITE_API_URL;
const TITLE = import.meta.env.VITE_API_TITLE;

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", company: "", message: "" });

  useEffect(() => {
    axios.get(`${API}/messages`).then((res) => {
      setMessages(res.data);
    });
  }, []);

const submit = async () => {
  try {
    // Get real client IP from ipify
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const userIP = ipRes.data.ip;

    // Submit with IP
    await axios.post(`${API}/submit`, {
      ...form,
      ip: userIP,
    });

    const res = await axios.get(`${API}/messages`);
    setMessages(res.data);
    setForm({ name: "", company: "", message: "" });
  } catch (err) {
    console.error("Error submitting message:", err);
  }
};

return (
  <div className="app-container">
    <div className="left-panel">
      <h1>{TITLE}</h1>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />
      <textarea
        placeholder="Leave a message..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <button onClick={submit}>Submit</button>
      <hr />
      <h2>Guestbook</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Message</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(messages) &&
            messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.name}</td>
                <td>{msg.company}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.timestamp).toLocaleDateString()}</td>
                <td>{msg.location}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>

    <div className="right-panel">
      <MapPanel entries={messages} />
      <StatsPanel entries={messages} />
    </div>
  </div>
);
}

export default App;

