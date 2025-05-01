import React from 'react'
import LoginPage from './components/Login'
import { Route, Routes } from 'react-router-dom'
import RaiseRequest from './components/RaiseRequest'
import ManagerDashboard from './components/ManagerDashboard'
import AdminDashboard from './components/AdminDashboard'
import SignUp from './components/SignUp'
import AllNotifications from './components/AllNotifications'
import Ledger from './components/Ledger'

const App = () => {
  return (
    <div className='text-red-500'>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/" element={<SignUp />} /> */}
        <Route path="/employee-dashboard" element={<RaiseRequest />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/all-notifications" element={<AllNotifications />} />
      </Routes>
    </div>
  )
}

export default App