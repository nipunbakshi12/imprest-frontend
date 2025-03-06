import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // BASE_URL/sigunup

  //   const handleLogin = () => {
  //     localStorage.setItem("user", JSON.stringify({ role, department }));

  //     if (role === "Employee") {
  //       navigate("/raise-request");
  //     } else if (role === "Manager") {
  //       navigate("/manager-dashboard");
  //     } else if (role === "Admin") {
  //       navigate("/admin-dashboard");
  //     }
  //   };

  const handleLogin = async () => {
    console.log("email", email);
    console.log("password", password);

    const response = await axios.post(`http://localhost:5000/api/signup`, {
      email,
      password,
      role,
      department,
    });

    console.log("api response", response);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sign Up
        </h2>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select Role
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="">-- Select Role --</option>
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>

          {/* Department Selection - Shown only for Employee and Manager */}
          {(role === "Employee" || role === "Manager") && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Select Department
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Login
        </button>

        {/* Additional Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Sign up
            </a>
          </p>
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800 font-semibold"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
