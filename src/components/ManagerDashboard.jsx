import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFunds = 500000; // Initial funds for each manager

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [funds, setFunds] = useState(initialFunds);
  const [requests, setRequests] = useState([]);
  const [managerData, setManagerData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Manager") {
      navigate("/");
      return;
    }

    setDepartment(user.department);
    console.log("Manager Department:", user.department);

    // Get manager's funds from localStorage
    const allBalances = JSON.parse(localStorage.getItem("balances")) || {};
    if (allBalances[user.department]) {
      setFunds(allBalances[user.department]); // Load the current balance for the department
    }

    // Get all requests and filter based on department
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    console.log("All Requests:", storedRequests);

    const departmentRequests = storedRequests.filter(
      (req) =>
        req.department.trim().toLowerCase() ===
        user.department.trim().toLowerCase()
    );

    console.log("Filtered Requests:", departmentRequests);
    setRequests(departmentRequests);
  }, [navigate]);

  const handleUrgentFunds = () => {
    alert("Request Sent");

    const newNotification = {
      department,
      message: `${department} department needs urgent funds!`,
      date: new Date().toLocaleString(),
    };

    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push(newNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  const handleAction = (index, action) => {
    let updatedRequests = [...requests];
    const requestAmount = parseInt(updatedRequests[index].amount);

    if (action === "approve") {
      if (funds >= requestAmount) {
        updatedRequests[index].status = "Approved";
        setFunds((prevFunds) => prevFunds - requestAmount);
      } else {
        alert("Insufficient funds to approve this request.");
        return;
      }
    } else {
      updatedRequests[index].status = "Rejected";
    }

    setRequests(updatedRequests);

    // Update the global requests in localStorage
    const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
    const updatedAllRequests = allRequests.map((req) =>
      req.description === updatedRequests[index].description &&
      req.department === updatedRequests[index].department
        ? updatedRequests[index]
        : req
    );

    localStorage.setItem("requests", JSON.stringify(updatedAllRequests));

    // Update balances in localStorage
    const allBalances = JSON.parse(localStorage.getItem("balances")) || {};
    allBalances[department] =
      funds - (action === "approve" ? requestAmount : 0);
    localStorage.setItem("balances", JSON.stringify(allBalances));

    // Update approved requests in Admin Dashboard
    if (action === "approve") {
      const approvedRequests =
        JSON.parse(localStorage.getItem("approvedRequests")) || [];
      approvedRequests.push(updatedRequests[index]);
      localStorage.setItem(
        "approvedRequests",
        JSON.stringify(approvedRequests)
      );
    }
  };

  const fetchManagerData = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/imprest/getManagerData",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response.data.data);
    const managers = response.data.data;
    setRequests(managers);
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Manager Dashboard
              <span className="text-blue-600 ml-2">({department})</span>
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
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
          </div>
        </div>

        {/* Balance and Urgent Funds Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-lg">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{funds.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleUrgentFunds}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md flex items-center gap-2"
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Request Urgent Funds
            </button>
          </div>
        </div>

        {/* Pending Requests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Pending Requests
            </h3>
          </div>
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
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500 font-medium"
                    >
                      No pending requests found
                    </td>
                  </tr>
                ) : (
                  requests
                    .filter((req) => req.status === "Pending")
                    .map((req, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600 font-medium">
                            ₹{parseInt(req.amount).toLocaleString()}
                          </span>
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
                              req.urgencyLevel === "urgencyLevel"
                                ? "bg-red-100 text-red-800"
                                : req.urgencyLevel === "Priority"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {req.vendorName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              req.urgencyLevel === "urgencyLevel"
                                ? "bg-red-100 text-red-800"
                                : req.urgencyLevel === "Priority"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleAction(index, "approve")}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition duration-300 ease-in-out"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(index, "reject")}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
