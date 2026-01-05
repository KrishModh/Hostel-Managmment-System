import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function RectorNavbar() {

    const [openMenu, setOpenMenu] = useState(false);
    const [rector, setRector] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const navigate = useNavigate();

    useEffect(() => {
        // yaha rector login use hoga future me
        setRector({ name: "Rector" });
    }, []);

    // THEME APPLY
    useEffect(() => {
        if (theme === "dark") document.body.classList.add("dark");
        else document.body.classList.remove("dark");

        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    function handleLogout() {
        localStorage.removeItem("rector");
        setOpenMenu(false);
        navigate("/");
    }

    return (
        <div className="rector-nav">

            {/* ---------- TOP BIG TITLE ---------- */}
            <div className="rector-title">
                Rector Panel
            </div>

            {/* ---------- NAVIGATION AREA ---------- */}
            <div className="rector-nav-area">

                {/* LEFT SIDE NAV BUTTON GROUPS */}
                <div className="rector-links">

                    {/* FIRST ROW */}
                    <div className="row-links">
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/students">Students</Link>
                        <Link to="/rector-complaints">Complaints</Link>
                    </div>

                    {/* SECOND ROW */}
                    <div className="row-links">
                        <Link to="/leaves">Leaves</Link>
                        <Link to="/rector/mess-menu">Mess Menu</Link>
                    </div>
                </div>

                {/* ---------- RIGHT PROFILE SIDE ---------- */}
                <div className="rector-right">


                    {/* Profile */}
                    <div
                        className="profile-circle"
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        <img
                            src="https://i.ibb.co/2kR5zq0/default-avatar.png"
                            alt="profile"
                        />
                    </div>

                    {openMenu && (
                        <div className="profile-menu">
                            <p>My Profile</p>
                            <p onClick={toggleTheme}>Theme
                                {theme === "dark" ? " Light " : " Dark "}
                            </p>
                            <p>Change Password</p>
                            <p className="logout" onClick={handleLogout}>
                                Logout
                            </p>                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default RectorNavbar;
