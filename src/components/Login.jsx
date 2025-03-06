import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const Base_URL = "http://localhost:5000"

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError("Please fill in all fields");
                return;
            }

            const response = await axios.post(`${Base_URL}/api/login`, { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setError("");
                alert("Login successful!");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
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
