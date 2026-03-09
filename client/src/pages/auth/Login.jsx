import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mx-auto bg-white p-8 rounded shadow-md w-full max-w-md">

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full">
          <h2 className="text-2xl font-bold mb-4">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 w-full mb-3 focus:outline-1 focus:outline-blue-500"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Password Field */}
          
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border border-gray-300 p-2 w-full focus:outline-1 focus:outline-blue-500"
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <div className="flex items-center mt-2 mb-3">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="text-sm text-gray-600">
            Show Password
          </label>
        </div>

            

          <button className="bg-blue-500 text-white p-2 w-full">
            Login
          </button>
        </form>
      </div>

      <p className="w-full text-center mt-6">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;