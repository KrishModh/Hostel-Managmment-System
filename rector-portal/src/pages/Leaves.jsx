import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Leaves.css";
import toast from "react-hot-toast";


function Leaves() {

    const [tab, setTab] = useState("pending");
    const [pending, setPending] = useState([]);
    const [approved, setApproved] = useState([]);
    const [rejected, setRejected] = useState([]);

    useEffect(() => {

        async function load() {

            if (tab === "pending") {
                const res = await fetch("http://127.0.0.1:8000/rector/leaves/pending");
                setPending(await res.json());
            }

            if (tab === "approved") {
                const res = await fetch("http://127.0.0.1:8000/rector/leaves/approved");
                setApproved(await res.json());
            }

            if (tab === "rejected") {
                const res = await fetch("http://127.0.0.1:8000/rector/leaves/rejected");
                setRejected(await res.json());
            }
        }

        load();

    }, [tab]);


    async function approve(id) {
        await fetch(`http://127.0.0.1:8000/rector/leaves/approve/${id}`, { method: "POST" });
        // alert("Leave Approved ✔");
        toast.success("Leave Approved ✔");
        setTab("approved");
    }

    async function reject(id) {
        await fetch(`http://127.0.0.1:8000/rector/leaves/reject/${id}`, { method: "POST" });
        // alert("Leave Rejected ❌");
        toast.success("Leave Rejected ❌");
        setTab("rejected");
    }


    // 🔹 SAFE DATE UTILS
    function toDateSafe(d) {
        if (!d) return null;

        if (d.includes("-")) {
            const parts = d.split("-");
            if (parts[0].length === 4) return new Date(d);          // yyyy-mm-dd
            const [dd, mm, yy] = parts; return new Date(`${yy}-${mm}-${dd}`); // dd-mm-yyyy
        }

        return new Date(d);
    }

    function diffDays(from, to) {
        const f = toDateSafe(from);
        const t = toDateSafe(to);
        if (!f || !t || isNaN(f) || isNaN(t)) return 0;
        return Math.ceil((t - f) / (1000 * 60 * 60 * 24)) + 1;
    }


    function LeaveCard({ l, showButtons }) {

        const from = l.from_date || l.fromDate;
        const to = l.to_date || l.toDate;

        return (
            <div className="leave-card">

                <div className="leave-top">
                    <span className={`status-chip 
              ${l.status === "pending" && "yellow"}
              ${l.status === "approved" && "green"}
              ${l.status === "rejected" && "red"}`}>
                        {l.status?.toUpperCase()}
                    </span>

                    <span className="days-chip">{diffDays(from, to)} Days</span>
                </div>

                <h3>{l.reason} – {l.place}</h3>

                <div className="leave-grid">

                    <p><b>👤 Name:</b> {l.student?.details?.studentName || "—"}</p>
                    <p><b>📞 Phone:</b> {l.student?.details?.mobile1 || "—"}</p>
                    <p><b>📧 Email:</b> {l.email}</p>

                    <p><b>🛏 Room:</b>
                        {l.student?.floor || "-"} /
                        {l.student?.room || "-"} /
                        {l.student?.bed || "-"}
                    </p>

                    <p><b>📅 From:</b> {from} {l.from_time || l.fromTime || ""}</p>
                    <p><b>📅 To:</b> {to} {l.to_time || l.toTime || ""}</p>

                </div>

                {showButtons && (
                    <div className="action-row">
                        <button className="btn approve" onClick={() => approve(l._id)}>
                            Approve
                        </button>

                        <button className="btn reject" onClick={() => reject(l._id)}>
                            Reject
                        </button>
                    </div>
                )}

            </div>
        );
    }


    return (
        <>
            <Navbar />

            <div className="leave-wrapper">

                <h2>🏖 Rector Leave Management</h2>

                <div className="leave-tabs">

                    <button className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>
                        🆕 Pending ({pending.length})
                    </button>

                    <button className={tab === "approved" ? "active" : ""} onClick={() => setTab("approved")}>
                        🟢 Approved ({approved.length})
                    </button>

                    <button className={tab === "rejected" ? "active" : ""} onClick={() => setTab("rejected")}>
                        🔴 Rejected ({rejected.length})
                    </button>

                </div>

                {tab === "pending" && pending.map(l =>
                    <LeaveCard key={l._id} l={l} showButtons />
                )}

                {tab === "approved" && approved.map(l =>
                    <LeaveCard key={l._id} l={l} />
                )}

                {tab === "rejected" && rejected.map(l =>
                    <LeaveCard key={l._id} l={l} />
                )}

            </div>
        </>
    );
}

export default Leaves;
