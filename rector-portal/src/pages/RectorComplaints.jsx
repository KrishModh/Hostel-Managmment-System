import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/rectorComplaints.css";
import toast from "react-hot-toast";

function RectorComplaints() {

    const [tab, setTab] = useState("pending");

    const [pending, setPending] = useState([]);
    const [working, setWorking] = useState([]);
    const [completed, setCompleted] = useState([]);

    useEffect(() => {

        async function load() {

            if (tab === "pending") {
                const res = await fetch("http://127.0.0.1:8000/complaint/rector/pending");
                setPending(await res.json());
            }

            if (tab === "working") {
                const res = await fetch("http://127.0.0.1:8000/complaint/rector/working");
                setWorking(await res.json());
            }

            if (tab === "completed") {
                const res = await fetch("http://127.0.0.1:8000/complaint/rector/completed");
                setCompleted(await res.json());
            }
        }

        load();

    }, [tab]);


    async function startWork(id) {
        await fetch(`http://127.0.0.1:8000/complaint/start/${id}`, { method: "POST" });
        // alert("Moved to Working 🚧");
        toast.success("Moved to Working 🚧");
        setTab("working");
    }

    async function completeWork(id) {
        await fetch(`http://127.0.0.1:8000/complaint/rector-complete/${id}`, { method: "POST" });
        // alert("Complaint Completed ✔");
        toast.success("Complaint Completed ✔");
        setTab("completed");
    }


    function ComplaintCard({ c, showStart, showComplete }) {

        const [stu, setStu] = useState(null);

        useEffect(() => {
            async function loadStudent() {
                const res = await fetch(`http://127.0.0.1:8000/student/${c.email}`);
                setStu(await res.json());
            }

            loadStudent();
        }, []);

        return (
            <div className="rc-card">

                <div className="rc-top">
                    <span className="rc-chip">{c.category}</span>
                    <span className={`rc-status 
              ${c.status === "pending" && "yellow"} 
              ${c.status === "working" && "blue"} 
              ${c.status === "completed" && "green"}`}>
                        {c.status}
                    </span>
                </div>

                <h3>{c.issue}</h3>
                <p className="desc">{c.description || "No description provided"}</p>

                <div className="rc-grid">
                    <p><b>👤 Name:</b> {stu?.details?.studentName || "N/A"}</p>
                    <p><b>📧 Email:</b> {c.email}</p>
                    <p><b>📞 Contact:</b> {stu?.details?.mobile1 || "-"}</p>
                    <p><b>🛏 Room:</b> {stu?.floor || "-"}/{stu?.room || "-"}/{stu?.bed || "-"}</p>
                </div>

                {showStart && (
                    <button className="btn blue" onClick={() => startWork(c._id)}>
                        Start Work
                    </button>
                )}

                {showComplete && (
                    <button className="btn green" onClick={() => completeWork(c._id)}>
                        Mark Completed
                    </button>
                )}

            </div>
        );
    }


    return (
        <>
            <Navbar />

            <div className="rc-wrapper">

                <h2>🏫 Rector Complaint Panel</h2>

                <div className="rc-tabs">
                    <button
                        className={tab === "pending" ? "active" : ""}
                        onClick={() => setTab("pending")}
                    >
                        🆕 New ({pending.length})
                    </button>

                    <button
                        className={tab === "working" ? "active" : ""}
                        onClick={() => setTab("working")}
                    >
                        🛠 Working ({working.length})
                    </button>

                    <button
                        className={tab === "completed" ? "active" : ""}
                        onClick={() => setTab("completed")}
                    >
                        ✅ Completed ({completed.length})
                    </button>
                </div>


                {tab === "pending" && (
                    <div>
                        {pending.length === 0 && <p>No new complaints</p>}
                        {pending.map(c => (
                            <ComplaintCard key={c._id} c={c} showStart={true} />
                        ))}
                    </div>
                )}

                {tab === "working" && (
                    <div>
                        {working.length === 0 && <p>No working complaints</p>}
                        {working.map(c => (
                            <ComplaintCard key={c._id} c={c} showComplete={true} />
                        ))}
                    </div>
                )}

                {tab === "completed" && (
                    <div>
                        {completed.length === 0 && <p>No completed complaints</p>}
                        {completed.map(c => (
                            <ComplaintCard key={c._id} c={c} />
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}

export default RectorComplaints;
