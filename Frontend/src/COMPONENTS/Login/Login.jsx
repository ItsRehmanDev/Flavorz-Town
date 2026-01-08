import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:4500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      setSnack({ open: true, message: errData.message || "Login failed", severity: "error" });
      return;
    }

    const data = await res.json();

    
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("email", data.email);
    localStorage.setItem("userName", data.name);

    setSnack({ open: true, message: data.message, severity: "success" });

    setTimeout(() => {
      if (data.role === "admin") navigate("/dashboard");
      else if (data.role === "user") navigate("/homepage");
    }, 500);

  } catch (err) {
    console.error("Login error:", err);
    setSnack({ open: true, message: "Server error. Try again.", severity: "error" });
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[450px] p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back 👋</h1>
        <p className="text-gray-500 text-center mb-8">Please log in to continue</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center">
          Don’t have an account?{" "}
          <Link className="text-teal-600 font-semibold hover:underline" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>

     
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
