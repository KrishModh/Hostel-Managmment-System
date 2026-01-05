import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/changePassword.css";
import toast from "react-hot-toast";

function ChangePassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [show, setShow] = useState(false);

    useEffect(() => {
        const em = localStorage.getItem("student");

        if (!em) {
            navigate("/login");
            return;
        }

        setEmail(em);
    }, []);

    async function changePassword() {

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("All fields required");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        const res = await fetch("http://127.0.0.1:8000/student/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                old_password: oldPassword,
                new_password: newPassword
            })
        });

        if (!res.ok) {
            alert("Old password incorrect");
            return;
        }

        // alert("Password updated successfully ✔");
        toast.success("Password updated successfully ✔");
        navigate("/dashboard");
    }

    return (
        <div className="cp-wrapper">

            <div className="cp-card">

                <h2>🔐 Change Password</h2>

                <p className="cp-email">
                    <b>Email:</b> {email}
                </p>

                <div className="cp-input-group">
                    <input
                        type={show ? "text" : "password"}
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                    />
                </div>

                <div className="cp-input-group">
                    <input
                        type={show ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="cp-input-group">
                    <input
                        type={show ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                <label className="cp-show">
                    <input type="checkbox" onChange={() => setShow(!show)} /> Show Password
                </label>

                <button className="cp-btn" onClick={changePassword}>
                    Update Password
                </button>

            </div>

        </div>
    );
}

export default ChangePassword;
