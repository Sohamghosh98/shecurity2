import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.js";
import Signup from "./pages/signup.js";
import HelpPage from "./pages/HelpPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelpPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<div>Forgot Password Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}
export default App;
