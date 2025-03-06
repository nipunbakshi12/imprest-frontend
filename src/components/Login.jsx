import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const Base_URL = "http://localhost:5000";

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const response = await axios.post(`${Base_URL}/api/login`, {
        email,
        password,
      });
      console.log("login res", response);
      const { role } = response.data.user;
      console.log("roles", role);

      if (role === "Employee") {
        navigate("/employee-dashboard");
      } else if (role === "Manager") {
        navigate("/manager-dashboard");
      } else if (role === "Admin") {
        navigate("/admin-dashboard");
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setError("");
        toast.success("Login successful!");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Sign in
            </button>

            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-600">
                Don't have an account?
              </span>
              <Link
                to="/"
                className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//     const [role, setRole] = useState("");
//     const [department, setDepartment] = useState("");
//     const navigate = useNavigate();

//     const roles = ["Employee", "Manager", "Admin"];
//     const departments = ["IT", "Finance", "Marketing", "HR"];

//     const handleRoleChange = (e) => {
//         setRole(e.target.value);
//         setDepartment("");
//     };

//     const handleLogin = () => {
//         localStorage.setItem("user", JSON.stringify({ role, department }));

//         if (role === "Employee") {
//             navigate("/raise-request");
//         } else if (role === "Manager") {
//             navigate("/manager-dashboard");
//         } else if (role === "Admin") {
//             navigate("/admin-dashboard");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Login Page</h2>

//                 <label className="block mb-2 font-medium">SELECT ROLE</label>
//                 <select
//                     className="w-full p-2 border rounded mb-4"
//                     value={role}
//                     onChange={handleRoleChange}
//                 >
//                     <option value="">-- Select Role --</option>
//                     {roles.map((roleOption) => (
//                         <option key={roleOption} value={roleOption}>{roleOption}</option>
//                     ))}
//                 </select>

//                 {(role === "Employee" || role === "Manager") && (
//                     <>
//                         <label className="block mb-2 font-medium">CHOOSE DEPARTMENT</label>
//                         <select
//                             className="w-full p-2 border rounded mb-4"
//                             value={department}
//                             onChange={(e) => setDepartment(e.target.value)}
//                         >
//                             <option value="">-- Select Department --</option>
//                             {departments.map((dept) => (
//                                 <option key={dept} value={dept}>{dept}</option>
//                             ))}
//                         </select>
//                     </>
//                 )}

//                 <button
//                     className={`w-full p-2 text-white rounded ${(role === "Admin" || (role && department)) ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
//                     disabled={!(role === "Admin" || (role && department))}
//                     onClick={handleLogin}
//                 >
//                     Login
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
