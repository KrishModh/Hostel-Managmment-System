// studnets detil page here show the detils of every student
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/StudentDetail.css";

function StudentDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/student-by-id/${id}`)
      .then(res => res.json())
      .then(data => setStudent(data));
  }, []);

  if (!student) return <h3 className="loading">Loading…</h3>;

  const d = student.details || {};

  return (
    <div className="details-wrapper">

      {/* BACK BUTTON */}
      <div className="back-holder">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>


      {/* LEFT PROFILE CARD */}
      <div className="left-profile-card">

        <img
          src={
            student.photo
              ? `http://127.0.0.1:8000/uploads/${student.photo}`
              : "https://i.ibb.co/2kR5zq0/default-avatar.png"
          }
          alt="profile"
        />

        <h2>{d.studentName}</h2>

        <p>📧 {student.email}</p>
        <p>📞 {d.mobile1}</p>

        <div className="pill-box">
          <span>{d.gender}</span>
          <span>{d.dob}</span>
        </div>

      </div>

      {/* RIGHT MAIN CARD */}
      <div className="right-details-card">

        <h2>Student Full Details</h2>

        <div className="grid-two">

          <section>
            <h3>🏫 Institute Details</h3>
            <p><b>Name:</b> {d.instituteName}</p>
            <p><b>Address:</b> {d.instituteAddress}</p>
          </section>

          <section>
            <h3>🧍 Personal Info</h3>
            <p><b>Gender:</b> {d.gender}</p>
            <p><b>DOB:</b> {d.dob}</p>
            <p><b>Nationality:</b> {d.nationality}</p>
            <p><b>State:</b> {d.state}</p>
          </section>

          <section>
            <h3>🏠 Address</h3>
            <p><b>City:</b> {d.city}</p>
            <p><b>District:</b> {d.district}</p>
            <p><b>Address:</b> {d.address}</p>
            <p><b>Pincode:</b> {d.pincode}</p>
          </section>

          <section>
            <h3>👨‍👩‍👦 Parents</h3>
            <p><b>Father:</b> {d.fatherName} ({d.fatherPhone})</p>
            <p><b>Mother:</b> {d.motherName}</p>
          </section>

          <section>
            <h3>🚨 Emergency Contact</h3>
            <p><b>Name:</b> {d.emergencyName}</p>
            <p><b>Relation:</b> {d.emergencyRelation}</p>
            <p><b>Phone:</b> {d.emergencyPhone}</p>
          </section>

          <section>
            <h3>🛏 Room Details</h3>
            <p><b>Floor:</b> {student.floor || "Not Allotted"}</p>
            <p><b>Room:</b> {student.room || "Not Allotted"}</p>
            <p><b>Bed:</b> {student.bed || "Not Allotted"}</p>
          </section>

        </div>

      </div>

    </div>
  );
}

export default StudentDetail;
