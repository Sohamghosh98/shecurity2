import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Simulate a successful login (no DB check)
    try {
      // For demonstration purposes, we'll assume any login is successful
      const token = "fake-jwt-token"; // Fake token for demo

      // Save token in localStorage
      localStorage.setItem("token", token);

      alert("Login successful");

      // Redirect to homepage (or dashboard)
      navigate("/"); // Redirect to homepage (or another page of your choice)

    } catch (err) {
      setError("Login failed"); // Simulating an error
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1588599038109-34894258f69b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHdvbWVuJTIwZW1wb3Blcm1lbnR8ZW58MHx8MHx8fDA%3D')",
      }}
    >
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-4 bg-gray-800 bg-opacity-70 fixed top-0 text-white">
        <div>
          <img src="/public/logo.jpg" alt="Logo" className="h-10" />
        </div>
        <div>
          <Link to="/signup" className="px-4 py-2 text-white">Signup</Link>
        </div>
      </nav>

      {/* Login Card */}
      <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg w-96 mt-20 backdrop-blur-md text-black">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-blue-500">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
