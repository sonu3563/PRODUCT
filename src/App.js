import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import Login from "./components/pages/Login";
import AppRoutes from "./components/Routes";
import RedirectByRole from "./components/utils/RedirectByRole";
import { AlertProvider } from "./components/context/AlertContext";
import UpdatePassword from "./components/pages/UpdatePassword";
function App() {
  return (
    <Router>
      <AlertProvider>
      <AuthProvider>
        {/* <RedirectByRole /> Include the component here */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </AuthProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
