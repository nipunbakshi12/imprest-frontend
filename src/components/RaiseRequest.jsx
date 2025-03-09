import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const RaiseRequest = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [urgency, setUrgency] = useState("");
  const [department, setDepartment] = useState("");
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([
    "HR",
    "Finance",
    "IT",
    "Operations",
  ]); // Add your department names
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "Vendor A",
      category: "IT Equipment",
      rating: "4.5",
      payment: "Full Advance",
    },
    {
      id: 2,
      name: "Vendor B",
      category: "Office Supplies",
      rating: "3.5",
      payment: "Partial Payment",
    },
    {
      id: 3,
      name: "Vendor C",
      category: "Software",
      rating: "4.5",
      payment: "Credit",
    },
    {
      id: 4,
      name: "Vendor D",
      category: "Hardware",
      rating: "3.8",
      payment: "Installments",
    },
  ]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [multiLevelData, setMultiLevelData] = useState({
    name: "",
    managerName: "",
    phone: "",
    employeeID: "",
  });

  const handleLogout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Navigate to login page
    navigate("/login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "Employee") {
      return;
    }
    setDepartment(user.department || ""); // Default to the user's department

    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(
      storedRequests.filter((req) => req.department === user.department)
    );
  }, []);

  const validateForm = () => {
    const { name, managerName, phone, employeeID } = multiLevelData;

    if (!name || !managerName || !phone || !employeeID) {
      alert("Please fill in all the fields.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return false;
    }
    if (!/^\d{7}$/.test(employeeID)) {
      alert("Employee ID must be exactly 7 digits.");
      return false;
    }
    return true;
  };

  // Handle Multi-Level Request Submission
  const handleMultiLevelSubmit = () => {
    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const multiLevelRequest = {
      description,
      amount,
      department: user.department,
      urgency,
      status: "Pending",
      ...multiLevelData, // Store additional form data
    };

    const multiRequests =
      JSON.parse(localStorage.getItem("multiLevelRequests")) || [];
    multiRequests.push(multiLevelRequest);
    localStorage.setItem("multiLevelRequests", JSON.stringify(multiRequests));

    setIsMultiLevel(false);
    setDescription("");
    setAmount("");
    setMultiLevelData({ name: "", managerName: "", phone: "", employeeID: "" });

    alert("Multi-Level Request Submitted Successfully!");
  };

  useEffect(() => {
    fetchAllImprests();
  }, []);

  const fetchAllImprests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/imprest/getAllImprestForEmployees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("get api");
      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch previous requests");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");

  //   const res = await axios.post(
  //     "http://localhost:5000/api/imprest/createImprest",
  //     {
  //       description,
  //       amount,
  //       urgencyLevel: urgency,
  //       vendorName: selectedVendor?.name,
  //       paymentDetail: selectedVendor?.payment
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   if (res.data.success) {
  //     toast.success("Request Created Successfully")
  //     await fetchAllImprests();
  //   }
  // };

  // salonniiiii

  // const [row, setRow] = useState([]);

  // const table = async () => {
  //   const token = localStorage.getItem("token");
  //   const response = await axios.get(
  //     "http://localhost:5000/api/imprest/getAllImprestForEmployees",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   console.log("api response", response.data.data);
  //   const api_response = response.data.data;
  //   setRow(api_response);
  //   setRequests(api_response)
  // };

  // useEffect(() => {
  //   table();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("vendorDetails", selectedVendor?.payment);
    const vendorDet = {
      description,
      amount,
      urgency,
    };

    const token = localStorage.getItem("token");
    console.log("token is", token);

    const response = await axios.post(
      "http://localhost:5000/api/imprest/createImprest",
      {
        description,
        amount,
        urgencyLevel: urgency,
        vendorName: selectedVendor?.name,
        paymentDetail: selectedVendor?.payment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">Raise Request</h2>
            <Link to="/login">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300 ease-in-out flex items-center gap-2 shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </Link>
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none min-h-[120px]"
                placeholder="Enter request description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option>Select Urgency Level</option>
                  <option>Routine</option>
                  <option>Priority</option>
                  <option>Urgency</option>
                </select>
              </div>
            </div>

            {/* Vendor Selection Table - Show only if basic fields are filled */}
            {description && amount && urgency && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Select Vendor
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendor Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Terms
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-black ">
                      {vendors.map((vendor) => (
                        <tr
                          key={vendor.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedVendor?.id === vendor.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="radio"
                              name="vendor"
                              checked={selectedVendor?.id === vendor.id}
                              onChange={() => setSelectedVendor(vendor)}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {vendor.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {vendor.category}
                          </td>
                          <td className="px-6 py-4 text-yellow-500 text-lg whitespace-nowrap">
                            {vendor.rating}
                          </td>
                          <td className="px-6 py-4 text-yellow-500 text-lg whitespace-nowrap">
                            {vendor.payment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Previous Requests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Previous Requests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Terms
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.department}
                    </td>
                    <td className="px-6 py-4">{req.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{req.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.urgency === "Urgency"
                            ? "bg-red-100 text-red-800"
                            : req.urgency === "Priority"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {req.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.vendorName}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.paymentDetail}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Multi-Level Request Modal */}
      {isMultiLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Multi-Level Request Details
            </h3>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Your Name"
                onChange={(e) =>
                  setMultiLevelData({ ...multiLevelData, name: e.target.value })
                }
                required
              />
              {/* Add similar styling to other inputs */}

              <button
                onClick={handleMultiLevelSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md"
              >
                Submit Multi-Level Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaiseRequest;
