import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./Navbar.css"

function Navbar() {

  const [openProfile, setOpenProfile] = useState(false)
  const [student, setStudent] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")

  const navigate = useNavigate()

  // ---------- load student ----------
  useEffect(() => {
    const email = localStorage.getItem("student")

    if (!email) {
      navigate("/login")
      return
    }

    fetch(`http://127.0.0.1:8000/student/${email}`)
      .then(res => res.json())
      .then(data => setStudent(data))
  }, [])

  // ---------- apply theme ----------
  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark")
    else document.body.classList.remove("dark")

    localStorage.setItem("theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  function logout() {
    localStorage.removeItem("student")
    setStudent(null)
    navigate("/login")
  }

  if (!student) return null

  return (
    <>
      <header className="navbar">

        {/* LEFT SIDE */}
        <div className="nav-left">
          <h2 className="nav-title">Student Portal</h2>

          {/* menu (mobile places this below title automatically via CSS) */}
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/complaints">Complaints</Link></li>
            <li><Link to="/leave">Leave</Link></li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {/* <button className="theme-btn" onClick={toggleTheme}> */}
            {/* {theme === "dark" ? "🌙" : "☀️"} */}
          {/* </button> */}

          <div
            className="profile-wrapper"
            onClick={() => setOpenProfile(prev => !prev)}
          >
            <img
              className="profile-img"
              src={
                student?.photo
                  ? `http://127.0.0.1:8000/uploads/${student.photo}`
                  : "https://i.ibb.co/2kR5zq0/default-avatar.png"
              }
              alt="profile"
            />
          </div>

          {openProfile && (
            <div className="profile-dropdown">

              <p><Link to="/profile">My Profile</Link></p>

              <p onClick={toggleTheme}>
                {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              </p>

              <p><Link to="/change-password">Change Password</Link></p>

              <p className="logout" onClick={logout}>Logout</p>
            </div>
          )}

        </div>
      </header>

      {/* overlay click closes profile menu */}
      {openProfile && (
        <div className="overlay" onClick={() => setOpenProfile(false)} />
      )}
    </>
  )
}

export default Navbar
