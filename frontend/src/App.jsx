import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


function App() {
  return (
    <React.StrictMode>
        <BrowserRouter>
            <NavBar />
            <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    </React.StrictMode>
    );
}
export default App;