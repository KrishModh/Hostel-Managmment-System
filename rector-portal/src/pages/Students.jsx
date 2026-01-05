import Navbar from "../components/Navbar";
import "../styles/students.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Students() {

    const [tab, setTab] = useState("request");

    const [requests, setRequests] = useState([]);
    const [activeStudents, setActiveStudents] = useState([]);
    const [oldStudents, setOldStudents] = useState([]);

    const [openMenu, setOpenMenu] = useState(null);

    // 👉 NEW STATE
    const [search, setSearch] = useState("");

    useEffect(() => {

        if (tab === "request") {
            fetch("http://127.0.0.1:8000/rector/pending-students")
                .then(res => res.json())
                .then(data => setRequests(data));
        }

        if (tab === "active") {
            fetch("http://127.0.0.1:8000/rector/active-students")
                .then(res => res.json())
                .then(data => setActiveStudents(data));
        }

        if (tab === "old") {
            fetch("http://127.0.0.1:8000/rector/old-students")
                .then(res => res.json())
                .then(data => setOldStudents(data));
        }

    }, [tab]);

    async function moveToOld(email) {
        await fetch(`http://127.0.0.1:8000/rector/move-old/${email}`, {
            method: "POST"
        });

        // alert("Moved to old students");
        toast.success("Moved to old students");
        setOpenMenu(null);
        setTab("old");
    }

    // 👉 SEARCH FILTER FUNCTION
    const match = stu =>
        (stu.details?.studentName || "").toLowerCase().includes(search) ||
        (stu.email || "").toLowerCase().includes(search) ||
        (stu.details?.mobile1 || "").toLowerCase().includes(search);

    return (
        <>
            <Navbar />

            <div className="students-page">

                <div className="student-tabs">
                    <button
                        className={tab === "request" ? "active-tab" : ""}
                        onClick={() => setTab("request")}
                    >
                        📩 Requests ({requests.length})
                    </button>

                    <button
                        className={tab === "active" ? "active-tab" : ""}
                        onClick={() => setTab("active")}
                    >
                        🟢 Active ({activeStudents.length})
                    </button>

                    <button
                        className={tab === "old" ? "active-tab" : ""}
                        onClick={() => setTab("old")}
                    >
                        📜 Old ({oldStudents.length})
                    </button>
                </div>

                {/* 🔍 SEARCH BAR */}
                <input
                    className="student-search"
                    type="text"
                    placeholder="🔍 Search by name, email or mobile..."
                    value={search}
                    onChange={e => setSearch(e.target.value.toLowerCase())}
                />

                <div className="student-card-container">

                    {/* REQUEST TAB */}
                    {tab === "request" && (
                        <>
                            <h2>📩 Student Requests</h2>

                            {requests.filter(match).length === 0 && <p>No matching students</p>}

                            {requests.filter(match).map(stu => (
                                <div className="student-card" key={stu._id}>

                                    <div>
                                        <b>{stu.details?.studentName || "N/A"}</b>
                                        <p>{stu.email}</p>
                                        <p>📞 {stu.details?.mobile1 || "N/A"}</p>
                                    </div>

                                    <span
                                        className="three-dot"
                                        onClick={() => setOpenMenu(openMenu === stu._id ? null : stu._id)}
                                    >
                                        ⋮
                                    </span>

                                    {openMenu === stu._id && (
                                        <div className="menu-popup">

                                            <Link to={`/student-details/${stu._id}`}>
                                                <p>📄 View Full Details</p>
                                            </Link>

                                            <p onClick={() => moveToOld(stu.email)}>
                                                ➡ Move to Old
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {/* ACTIVE TAB */}
                    {tab === "active" && (
                        <>
                            <h2>🟢 Active Students</h2>

                            {activeStudents.filter(match).length === 0 && <p>No matching students</p>}

                            {activeStudents.filter(match).map(stu => (
                                <div className="student-card" key={stu._id}>

                                    <div>
                                        <b>{stu.details?.studentName || "N/A"}</b>
                                        <p>{stu.email}</p>
                                        <p>🛏 Room: {stu.room || "—"} | Bed: {stu.bed || "—"}</p>
                                        <p>📞 {stu.details?.mobile1 || "N/A"}</p>
                                    </div>

                                    <span
                                        className="three-dot"
                                        onClick={() => setOpenMenu(openMenu === stu._id ? null : stu._id)}
                                    >
                                        ⋮
                                    </span>

                                    {openMenu === stu._id && (
                                        <div className="menu-popup">
                                            <Link to={`/student-detail/${stu._id}`}>
                                                <p>📄 View Full Details</p>
                                            </Link>

                                            <p onClick={() => moveToOld(stu.email)}>
                                                ➡ Move to Old
                                            </p>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </>
                    )}

                    {/* OLD TAB */}
                    {tab === "old" && (
                        <>
                            <h2>📜 Old Students</h2>

                            {oldStudents.filter(match).length === 0 && <p>No matching students</p>}

                            {oldStudents.filter(match).map(stu => (
                                <div className="student-card" key={stu._id}>

                                    <div>
                                        <b>{stu.details?.studentName}</b>
                                        <p>{stu.email}</p>
                                        <p>📞 {stu.details?.mobile1 || "N/A"}</p>
                                    </div>

                                    <Link to={`/student-detail/${stu._id}`}>
                                        <button className="view-btn">View Details</button>
                                    </Link>

                                </div>
                            ))}
                        </>
                    )}

                </div>

            </div>
        </>
    );
}

export default Students;
