import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/dashboard.css"
import toast from "react-hot-toast";

function Dashboard() {

  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [menu, setMenu] = useState(null)

  useEffect(() => {

    const email = localStorage.getItem("student")

    if (!email) {
      navigate("/login")
      return
    }

    fetch(`http://127.0.0.1:8000/student/${email}`)
      .then(res => res.json())
      .then(data => setStudent(data))

    fetch("http://127.0.0.1:8000/mess/today")
      .then(res => res.json())
      .then(data => setMenu(data))

  }, [])

  if (!student) return <h3>Loading…</h3>

  const d = student.details

  return (
    <div className="dash-wrapper">

      {/* LEFT CARD */}
      <div className="dash-card left">

        <img
          className="dash-avatar"
          src={
            student?.photo
              ? `http://127.0.0.1:8000/uploads/${student.photo}`
              : "https://i.ibb.co/2kR5zq0/default-avatar.png"
          }
          alt="profile"
        />

        <h2 className="dash-name">{d.studentName}</h2>
        <p className="dash-sub">{d.instituteName}</p>

        <p className="room-line">
          Floor: {student.floor || "-"} |
          Room: {student.room || "-"} |
          Bed: {student.bed || "-"}
        </p>

        <div className="divider"></div>

        <div className="info-grid">
          <p><b>Student Phone:</b> {d.mobile1}</p>
          <p><b>Email:</b> {student.email}</p>
          <p><b>Guardian Phone:</b> {d.fatherPhone}</p>
          <p><b>Guardian Email:</b> {d.fatherEmail || "-"}</p>
          <p><b>City:</b> {d.city}</p>
          <p><b>Address:</b> {d.address}</p>
        </div>

      </div>

      {/* RIGHT CARD */}
      <div className="dash-card right">

        <h1 className="welcome">Welcome, {d.studentName?.split(" ")[0]} 👋</h1>

        <h3 className="mess-title">Today's Mess Menu 🍽️</h3>

        {!menu?.date && (
          <p className="empty-text">No mess menu updated yet</p>
        )}

        {menu?.date && (
          <div className="menu-box">
            <p><b>Breakfast:</b> {menu.breakfast}</p>
            <p><b>Lunch:</b> {menu.lunch}</p>
            <p><b>Dinner:</b> {menu.dinner}</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
