import React from "react";
import { BrowserRouter} from "react-router-dom";
import DoctorRoutes from "./routes/DoctorRoutes";


function App() {
  return (
    <React.StrictMode>
        <BrowserRouter>
            <DoctorRoutes />
        </BrowserRouter>
    </React.StrictMode>
    );
}
export default App;