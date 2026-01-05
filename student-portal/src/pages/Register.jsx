import { useState } from "react";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";

function Register() {

  const [serverOtp, setServerOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [form, setForm] = useState({
    email: "",
    mobile1: "",
    mobile2: "",
    password: "",
    confirm: "",

    instituteName: "",
    instituteAddress: "",

    title: "",
    studentName: "",
    gender: "",
    dob: "",
    nationality: "Indian",
    state: "Gujarat",

    aadhar: "",

    address: "",
    city: "",
    district: "",
    pincode: "",

    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",

    motherName: "",
    motherPhone: "",

    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function sendOtp() {
    if (!form.email) return alert("Enter email first");

    try {
      const res = await axios.post("http://127.0.0.1:8000/send-otp", {
        email: form.email
      });

      setServerOtp(res.data.otp);
      alert("OTP sent ✔");
    } catch {
      alert("OTP sending failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (enteredOtp !== serverOtp) return alert("OTP not matched");
    if (form.password !== form.confirm) return alert("Passwords do not match");

    await axios.post("http://127.0.0.1:8000/register", {
      email: form.email,
      password: form.password,
      data: form
    });

    if (profilePhoto) {
      const fd = new FormData();
      fd.append("file", profilePhoto);

      await fetch(`http://127.0.0.1:8000/upload-photo/${form.email}`, {
        method: "POST",
        body: fd
      });
    }

    // alert("Registration completed 🎉 Wait for rector approval");
    toast.success("Registration completed 🎉 Wait for rector approval");
  }

  return (
    <div className="register-wrapper">

      <div className="register-card">

        <h2>📝 Student Registration</h2>
        <p className="reg-sub">Fill all details carefully — rector will verify</p>

        <form onSubmit={handleSubmit}>

          {/* 1 LOGIN */}
          <h3>1️⃣ Account Login Details</h3>

          <div className="grid-2">
            <input name="email" placeholder="Email" onChange={handleChange} />
            <button type="button" className="otp-btn" onClick={sendOtp}>Send OTP</button>
          </div>

          <input placeholder="Enter OTP" onChange={e => setEnteredOtp(e.target.value)} />

          <div className="grid-2">
            <input name="mobile1" placeholder="Mobile Number 1" onChange={handleChange} />
            <input name="mobile2" placeholder="Mobile Number 2" onChange={handleChange} />
          </div>

          <div className="grid-2">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="password" name="confirm" placeholder="Confirm Password" onChange={handleChange} />
          </div>

          {/* 2 INSTITUTE */}
          <h3>2️⃣ Institute Details</h3>

          <input name="instituteName" placeholder="Institute Name" onChange={handleChange} />
          <input name="instituteAddress" placeholder="Institute Address" onChange={handleChange} />

          {/* 3 STUDENT */}
          <h3>3️⃣ Student Details</h3>

          <div className="grid-2">
            <input name="title" placeholder="Title (Mr./Ms.)" onChange={handleChange} />
            <input name="studentName" placeholder="Full Name" onChange={handleChange} />
          </div>

          <div className="grid-3">
            <input name="gender" placeholder="Gender" onChange={handleChange} />
            <input type="date" name="dob" onChange={handleChange} />
            <input name="aadhar" placeholder="Aadhar Number" onChange={handleChange} />
          </div>

          <label className="photo-label">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfilePhoto(e.target.files[0])}
          />

          {/* 4 ADDRESS */}
          <h3>4️⃣ Address Details</h3>

          <input name="address" placeholder="Full Address" onChange={handleChange} />

          <div className="grid-3">
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="district" placeholder="District" onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />
          </div>

          {/* 5 PARENTS */}
          <h3>5️⃣ Parent Details</h3>

          <div className="grid-2">
            <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
            <input name="fatherPhone" placeholder="Father Phone" onChange={handleChange} />
          </div>

          <input name="fatherEmail" placeholder="Father Email" onChange={handleChange} />

          {/* 6 EMERGENCY */}
          <h3>6️⃣ Emergency Contact</h3>

          <div className="grid-3">
            <input name="emergencyName" placeholder="Name" onChange={handleChange} />
            <input name="emergencyRelation" placeholder="Relation" onChange={handleChange} />
            <input name="emergencyPhone" placeholder="Phone" onChange={handleChange} />
          </div>

          <button type="submit" className="submit-reg-btn">
            🚀 Submit Registration
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;
