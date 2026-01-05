import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/mess.css";
import toast from "react-hot-toast";

function MessMenu() {

  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/mess/today")
      .then(res => res.json())
      .then(data => {
        setBreakfast(data.breakfast || "");
        setLunch(data.lunch || "");
        setDinner(data.dinner || "");
      });
  }, []);

  async function saveMenu() {

    await fetch("http://127.0.0.1:8000/rector/mess/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ breakfast, lunch, dinner })
    });

    // alert("Mess menu updated ✔");
    toast.success("Mess menu updated ✔");
  }

  return (
    <>
      <Navbar />

      <div className="mess-wrapper">

        <h2>🍽 Mess Menu — Rector Control</h2>

        <div className="mess-card">

          <label>🍳 Breakfast</label>
          <input value={breakfast} onChange={e => setBreakfast(e.target.value)} />

          <label>🍛 Lunch</label>
          <input value={lunch} onChange={e => setLunch(e.target.value)} />

          <label>🍕 Dinner</label>
          <input value={dinner} onChange={e => setDinner(e.target.value)} />

          <button onClick={saveMenu}>💾 Save Today's Menu</button>

        </div>
      </div>
    </>
  );
}

export default MessMenu;
