import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [refillAmount, setRefillAmount] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("IT");
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [disbursedFunds, setDisbursedFunds] = useState([]);
  const [multiLevelRequests, setMultiLevelRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [balances, setBalances] = useState({});
  const [specialFunds, setSpecialFunds] = useState(10000000);
  const [activeTab, setActiveTab] = useState("approved");
  const departments = ["IT", "Finance", "Marketing", "HR"];
  const navigate = useNavigate();

  // const url = import.meta.env.BASE_URL

  // useEffect(() => {
  //   const savedBalances = JSON.parse(localStorage.getItem("balances")) || {
  //     IT: 500000,
  //     Finance: 500000,
  //     Marketing: 500000,
  //     HR: 500000,
  //   };
  //   setBalances(savedBalances);

  //   setApprovedRequests(
  //     JSON.parse(localStorage.getItem("approvedRequests")) || []
  //   );
  //   setDisbursedFunds(JSON.parse(localStorage.getItem("disbursedFunds")) || []);
  //   setMultiLevelRequests(
  //     JSON.parse(localStorage.getItem("multiLevelRequests")) || []
  //   );
  //   setNotifications(JSON.parse(localStorage.getItem("notifications")) || []);
  //   setSpecialFunds(
  //     JSON.parse(localStorage.getItem("specialFunds")) || 10000000
  //   ); // Load Special Funds
  // }, []);

  const fetchAdminLeads = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/imprest/getAdminData`
    );
    const data = response.data.data;
    setApprovedRequests(data);
  };

  useEffect(() => {
    fetchAdminLeads();
  }, []);

  function convertToReadableDate(dateString) {
    const date = new Date(dateString);

    // Array for months
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get date components
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Function to add ordinal suffix to day
    function getOrdinalSuffix(day) {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }

    // Combine all parts
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  }

  const handleModalOpen = (e) => {
    console.log("test", e);
  };

  const handleRefill = () => {
    if (!refillAmount || refillAmount <= 0) {
      alert("Please enter a valid refill amount.");
      return;
    }

    const newDisbursement = {
      department: selectedDepartment,
      amount: parseInt(refillAmount),
      date: new Date().toLocaleString(),
    };

    const updatedDisbursedFunds = [...disbursedFunds, newDisbursement];
    setDisbursedFunds(updatedDisbursedFunds);
    localStorage.setItem(
      "disbursedFunds",
      JSON.stringify(updatedDisbursedFunds)
    );

    const updatedBalances = {
      ...balances,
      [selectedDepartment]:
        (balances[selectedDepartment] || 0) + parseInt(refillAmount),
    };
    setBalances(updatedBalances);
    localStorage.setItem("balances", JSON.stringify(updatedBalances));

    setRefillAmount("");
    alert(`₹${refillAmount} refilled to ${selectedDepartment} successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
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
          </div>
        </div>

        {/* Refill Funds Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Refill Funds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter refill amount"
                value={refillAmount}
                onChange={(e) => setRefillAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="mt-6 w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md"
            onClick={handleRefill}
          >
            Refill Amount
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            {["approved", "disbursed", "multi-level", "notifications"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition duration-200 ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "approved" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Approved Requests
                </h3>
                {approvedRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No approved requests.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            View
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {approvedRequests.map((req, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {req.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                              ₹{req.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {req.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {convertToReadableDate(req.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-300  ">
                              <button onClick={(e) => handleModalOpen(e)}>
                                <FaEye />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Similar styling for other tabs... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
