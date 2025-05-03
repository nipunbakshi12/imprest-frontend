import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const roles = ["Employee", "Manager", "Admin"];
  const departments = ["IT", "Finance", "Marketing", "HR"];

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setDepartment("");
  };

  const handleLogin = async () => {
    console.log("email", email);
    console.log("password", password);

    const response = await axios.post(`https://imprest-backend-1.onrender.com/api/signup`, {
      email,
      password,
      role,
      department,
    });
    // console.log("Response12", response)

    if (response?.data?.token) {
      toast.success("New Account Created Successfully")
      navigate('/')
    }

    // console.log("api response", response);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2b7efe]">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="">-- Select Role --</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          {(role === "Employee" || role === "Manager") && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1"
        >
          Sign Up
        </button>

        {/* Link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>

  );
};

export default LoginPage;
