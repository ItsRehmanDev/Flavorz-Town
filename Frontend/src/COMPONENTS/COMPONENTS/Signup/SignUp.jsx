import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4500/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      setSnackMessage(data.message || "Sign Up Successful!");
      setSnackSeverity("success");
      setSnackOpen(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setSnackMessage("Sign Up failed!");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[450px] p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create Account 🚀
        </h1>
        <p className="text-gray-500 text-center mb-8">Sign up to continue</p>

        <form onSubmit={handleSignUp} className="space-y-5">
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Full Name"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none border-gray-300 text-sm"
            required
          />
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none border-gray-300 text-sm"
            required
          />
          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none border-gray-300 text-sm"
            required
          />
          <button
            type="submit"
            className="w-5/7 py-3 h-auto bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition mx-auto block"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default SignUp;
