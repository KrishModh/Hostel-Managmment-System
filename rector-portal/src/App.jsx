import { BrowserRouter, Routes, Route } from "react-router-dom"
import RectorLogin from "./pages/RectorLogin"
import RectorDashboard from "./pages/RectorDashboard"
import Students from "./pages/Students"
import { useState } from "react"
import StudentDetails from "./pages/StudentDetails"
import RectorComplaints from "./pages/RectorComplaints";
import Leaves from "./pages/Leaves"
import MessMenu from "./pages/MessMenu";
import StudentDetail from "./pages/StudentDetail";
import { Toaster } from "react-hot-toast";


function App() {
  const [isRectorLogged, setIsRectorLogged] = useState(
    localStorage.getItem("rector") === "true"
  )

  return (
    <BrowserRouter>
        <Toaster position="top-right" />
      <Routes>

        <Route path="/" element={<RectorLogin setIsRectorLogged={setIsRectorLogged} />} />

        {isRectorLogged && (
          <>

            <Route path="/dashboard" element={<RectorDashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student-details/:id" element={<StudentDetails />} />
            <Route path="/rector-complaints" element={<RectorComplaints />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/rector/mess-menu" element={<MessMenu />} />
            <Route path="/student-detail/:id" element={<StudentDetail />} />


          </>
        )}

      </Routes>
    </BrowserRouter>
  )
}

export default App
