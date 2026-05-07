import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/doctor/Dashboard";
import Footer from "./components/layout/Footer";
import DoctorNavbar from "./components/layout/DoctorNavbar";


function App() {
  return (
    <React.StrictMode>
        <BrowserRouter>
            <DoctorNavbar />
            <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    </React.StrictMode>
    );
}
export default App;