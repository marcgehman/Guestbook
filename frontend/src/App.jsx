import { useEffect, useState } from "react";
import axios from "axios";

import MapPanel from "./components/MapPanel/MapPanel";
import StatsPanel from "./components/StatsPanel/StatsPanel";

const API = import.meta.env.VITE_API_URL;
const TITLE = import.meta.env.VITE_API_TITLE;

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", company: "", message: "" });

  useEffect(() => {
    axios.get(`${API}/messages`).then((res) => {
      
      const sorted = res.data.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setMessages(sorted);
    });
  }, []);

const submit = async () => {
  try {
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const userIP = ipRes.data.ip;

    await axios.post(`${API}/submit`, {
      ...form,
      ip: userIP,
    });

    const res = await axios.get(`${API}/messages`);

    const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setMessages(sorted);
    setForm({ name: "", company: "", message: "" });
  } catch (err) {
    console.error("Error submitting message:", err.response?.data || err.message);
  }
};

return (
  <>
    <div className="header-bar">Marc’s Guestbook</div>

    <div className="map-panel card">
      <MapPanel entries={messages} />
    </div>

    <div className="app-container">
      <div className="card left-panel">
        <h2>Visitor Log</h2>
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
        <hr />
        <h2>Leave a Message!</h2>
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
          placeholder="Message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button onClick={submit}>Submit</button>
      </div>

      <div className="card right-panel">
        <StatsPanel entries={messages} />
      </div>
    </div>
  </>
);
}

export default App;


