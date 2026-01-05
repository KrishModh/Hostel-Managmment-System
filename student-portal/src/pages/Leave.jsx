import { useEffect, useState } from "react";
import "../styles/leave.css";
import toast from "react-hot-toast";

function Leave() {

  const email = localStorage.getItem("student");

  const [tab, setTab] = useState("add");

  const [reason, setReason] = useState("");
  const [place, setPlace] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [remarks, setRemarks] = useState("");

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (!email) return;

    fetch(`http://127.0.0.1:8000/student/leaves/${email}`)
      .then(res => res.json())
      .then(data => setLeaves(data));
  }, [tab]);

  async function applyLeave() {

    if (!reason || !place || !fromDate || !toDate) {
      alert("Fill required fields");
      return;
    }

    await fetch("http://127.0.0.1:8000/leave/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        reason,
        place,
        fromDate,
        toDate,
        fromTime,
        toTime,
        remarks
      })
    });

    // alert("Leave request submitted");
    toast.success("Leave request submitted ✔️");
    setTab("status");
  }

  return (
    <div className="leave-container">

      <h2>Leave Application</h2>

      <div className="leave-tabs">
        <button className={tab === "add" ? "active-leave-tab" : ""} onClick={() => setTab("add")}>➕ Apply Leave</button>
        <button className={tab === "status" ? "active-leave-tab" : ""} onClick={() => setTab("status")}>📋 Leave Status</button>
      </div>

      {/* ADD LEAVE */}
      {tab === "add" && (
        <div className="leave-card">

          <h3>Apply for Leave</h3>

          <select onChange={e => setReason(e.target.value)}>
            <option value="">Select Leave Reason</option>
            <option>Holiday</option>
            <option>Medical leave</option>
            <option>Personal Work</option>
            <option>Project Work</option>
            <option>Other</option>
          </select>

          <div className="two-input-row">
            <input type="date" onChange={e => setFromDate(e.target.value)} />
            <input type="time" onChange={e => setFromTime(e.target.value)} />
          </div>

          <div className="two-input-row">
            <input type="date" onChange={e => setToDate(e.target.value)} />
            <input type="time" onChange={e => setToTime(e.target.value)} />
          </div>

          <input
            placeholder="Place of Visit"
            onChange={e => setPlace(e.target.value)}
          />

          <textarea
            placeholder="Remarks (optional)"
            onChange={e => setRemarks(e.target.value)}
          />

          <button className="primary-btn" onClick={applyLeave}>Submit Leave</button>

        </div>
      )}

      {/* STATUS */}
      {tab === "status" && (
        <div className="leave-card">

          <h3>Leave Status</h3>

          {leaves.length === 0 && <p>No leave applied yet</p>}

          <table className="leave-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>From</th>
                <th>To</th>
                <th>Place</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map(l => (
                <tr key={l._id}>
                  <td>{l.reason}</td>
                  <td>{l.fromDate} {l.fromTime}</td>
                  <td>{l.toDate} {l.toTime}</td>
                  <td>{l.place}</td>
                  <td>
                    <span className={`leave-badge ${l.status}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Leave;
