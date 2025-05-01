import axios from "axios";
import React, { useState, useEffect } from "react";
import { BiNotification } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsJournalBookmarkFill } from "react-icons/bs";


// import { FaUserPlus } from "react-icons/fa";
import Modal from './Modal'
import toast from "react-hot-toast";

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


  const [isReading, setIsReading] = useState(false); // Add state for read status

  const navigate = useNavigate();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // LEDGER
  // const [isModalOpenLedger, setIsModalOpenLedger] = useState(false);








  // Notification Modals
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const openNotificationModal = () => {
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  const fetchAdminLeads = async () => {
    const response = await axios.get(
      'http://localhost:5000/api/imprest/getAdminData'
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

  const handleRefill = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.post('http://localhost:5000/api/imprest/refillAmount',
      {
        refillAmount: refillAmount,
        department: selectedDepartment
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      },
    )
    if (res.data.success) {
      toast.success("Funds has been sent")
      setRefillAmount("")
      getDisbursedFunds()
    }
  };

  const getDisbursedFunds = async () => {
    const res1 = await axios.get('http://localhost:5000/api/imprest/disbursedFunds')
    const disbursedFunds = res1.data.data
    setDisbursedFunds(disbursedFunds)
  }

  // GET NOTIFICATIONS
  const getNotifications = async () => {
    const token = localStorage.getItem("token");
    const notifications = await axios.get('http://localhost:5000/api/imprest/notification', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // console.log(notifications.data.data)
    const allNotifications = notifications.data.data
    const unreadNotifications = notifications?.data?.data.filter(noti => noti.read === false);
    console.log("False Wale", unreadNotifications)
    setNotifications(unreadNotifications)
  }

  function formatDate(isoString) {
    const date = new Date(isoString);

    // Options for formatting the date
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // Use 12-hour time format
    };

    // Use Intl.DateTimeFormat for localization and formatting
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  const handleRead = async (id) => {
    setIsReading(true); // Change color immediately
    try {
      console.log("id", id)
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/imprest/notification/${id}`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("RESPONSE", response)

      if (response?.data?.success) {
        console.log("Hello")
        toast.success("Notification marked as read");
        getNotifications()
      } else {
        toast.error(response || "FAILED TO MARK NOTIFICATION");
        setIsReading(false); // Reset if failed
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read");
    }
  };


  useEffect(() => {
    getNotifications()
    getDisbursedFunds()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h2>

            <div className="flex justify-center items-center text-black gap-4">

              {/* <div className="relative">
                <div className="text-3xl cursor-pointer" onClick={openNotificationModal}>
                  <IoNotificationsOutline />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {notifications.length}

                    </span>
                  )}
                </div>

                {isNotificationModalOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white p-4 rounded shadow-md max-w-sm w-screen z-50">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n, i) => (
                        <div
                          key={i}
                          className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 ease-in-out"
                        >
                          <p>{n.message} - {formatDate(n.createdAt)}</p>
                          <button
                            onClick={() => handleRead(n._id)} // Use n.id or n._id based on your data structure
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
                          >
                            Mark as read
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={closeNotificationModal} // Close the modal when clicked
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                      Close
                    </button>
                  </div>
                )}


              </div> */}

              <div className="realtive">
                <div
                  className="text-3xl cursor-pointer"
                  onClick={() => navigate('/ledger')}
                >
                  <BsJournalBookmarkFill />
                </div>
              </div>


              <div className="relative">
                {/* Notification Icon that triggers the modal on click */}
                <div className="text-3xl cursor-pointer" onClick={openNotificationModal}>
                  <IoNotificationsOutline />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {notifications.length}
                    </span>
                  )}
                </div>

                {isNotificationModalOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white p-4 rounded shadow-md max-w-lg w-screen z-50">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n, i) => (
                        <div
                          key={i}
                          className="text-blue-800 p-4 rounded-lg shadow-sm hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out"
                        >
                          <p>
                            {n.message} - {formatDate(n.createdAt)}
                            <span
                              onClick={() => handleRead(n._id)}
                              className={`ml-2 cursor-pointer transition duration-300 ease-in-out ${isReading ? 'text-red-600' : 'text-white-600'
                                } underline hover:text-red-200`} // Conditional styling
                            >
                              Mark as read
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out" onClick={() => navigate('/all-notifications')}>
                      All Notifications
                    </button>
                    <button
                      onClick={closeNotificationModal}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleOpenModal}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
              >
                New User
              </button>

              <Modal isOpen={isModalOpen} onClose={handleCloseModal} />

              <div>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                  className="bg-red-500 hover:bg-red-600  text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
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
          </div>
        </div>

        {/* Refill Funds Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 ">Refill Funds</h3>
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
            {["approved", "disbursed"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition duration-200 ${activeTab === tab
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
                        {approvedRequests
                          .filter((req) => req.status === "Approv")
                          .map((req, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">{req.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                                ₹{req.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{req.department}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {convertToReadableDate(req.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-blue-300">
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

            {activeTab === "disbursed" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Disbursed Requests
                </h3>
                {disbursedFunds.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No approved requests.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {disbursedFunds.map((req, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {req.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                              ₹{req.refillAmount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {convertToReadableDate(req.createdAt)}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* <div className="p-6">
            {activeTab === "disbursed" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Disbursed Requests
                </h3>
              </div>
            )}

          </div> */}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;