import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/rectorLogin.css"

function RectorLogin({ setIsRectorLogged }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)

    const navigate = useNavigate()

    function handleLogin(e) {
        e.preventDefault()

        if (email === "admin" && password === "admin123") {
            setIsRectorLogged(true)
            localStorage.setItem("rector", "true")
            navigate("/dashboard")
        } else {
            alert("Invalid rector credentials")
        }
    }

    return (
        <div className="rector-auth-wrapper">

            <div className="rector-card">

                <h2>🏫 Rector Login</h2>
                <p className="subtitle">Administrator access only</p>

                <form onSubmit={handleLogin}>

                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter rector username"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>

                    <div className="password-box">
                        <input
                            type={show ? "text" : "password"}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={() => setShow(!show)}>
                            {show ? "🙈" : "👁"}
                        </span>
                    </div>

                    <button className="login-btn">Login</button>

                </form>
            </div>
        </div>
    )
}

export default RectorLogin
