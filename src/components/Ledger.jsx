import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// OPTIONAL ─ if you want the icons shown in the demo markup
// import { BanknotesIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

const Ledger = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);

    const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-300 rounded-md shadow-md p-2 max-w-[180px]">
                    <p className="text-sm font-medium text-gray-700 break-words whitespace-normal">
                        {payload[0].name}
                    </p>
                    <p className="text-xs text-gray-500">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }

        return null;
    };

    // inside the component
    const handleDownloadExcel = () => {
        if (!selectedDept) return;

        const approvedData = selectedDept.balanceHistory
            ?.filter((req) => req.type === "expense")
            .map((req) => ({
                Description: req.description,
                Amount: req.amount,
                ApprovedBy: managerMapping[req.approvedBy._id] || "Unknown",
                BalanceBefore: req.balanceBefore,
                BalanceAfter: req.balanceAfter,
            })) || [];

        const refillData = selectedDept.fundsDisbursed
            ?.flatMap((fund) => fund.refillAmountHistory.map(entry => ({
                RefillAmount: entry.amount,
                Date: new Date(entry.date).toLocaleString(),
            }))) || [];

        const wb = XLSX.utils.book_new();

        const approvedSheet = XLSX.utils.json_to_sheet(approvedData);
        const refillSheet = XLSX.utils.json_to_sheet(refillData);

        XLSX.utils.book_append_sheet(wb, approvedSheet, "Approved Requests");
        XLSX.utils.book_append_sheet(wb, refillSheet, "Funds Disbursed");

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${selectedDept.department}_Ledger.xlsx`);
    };




    const managerMapping = {
        "67d29af0dab831e21965f8a6": "IT Manager",
        "67c9e8f664cda4d69087fd93": "HR Manager",
        "67d26d305fb9abe33b05abec": "Finance",
        "680be44deabd861e6f2dd595": "Marketing"
    };


    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    'http://localhost:5000/api/imprest/getLedgerForAdmin',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDepartments(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBalances();
    }, []);

    /* ----------------------------- RENDER ----------------------------- */
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
            <h1 className="text-center text-4xl font-extrabold tracking-tight text-slate-800 mb-10">
                Department Ledger
            </h1>

            {/* ─── DEPARTMENT CARDS ────────────────────────────────────── */}
            <section className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {departments.map((dept, i) => {
                    const active = selectedDept?.department === dept.department;

                    return (
                        <article
                            key={i}
                            onClick={() => setSelectedDept(dept)}
                            className={`
                relative cursor-pointer rounded-2xl bg-white/60
                backdrop-blur
                shadow-lg ring-1 ring-black/5
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                ${active ? 'ring-2 ring-indigo-500' : ''}
              `}
                        >
                            {/* horizontal gradient accent bar */}
                            <span
                                className="absolute inset-x-0 top-0 h-1 rounded-t-2xl
                           bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            />

                            <div className="p-6 flex flex-col justify-between h-full">
                                <header>
                                    <h2 className="text-lg font-semibold text-slate-700">
                                        {dept.department}
                                    </h2>
                                </header>

                                <footer className="mt-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold text-emerald-600 flex items-center gap-1">
                                            ₹{Number(dept.totalRefill).toLocaleString()}
                                        </p>

                                        {dept.approvedRequests?.length > 0 && (
                                            <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-600">
                                                {dept.approvedRequests.length} approved request{dept.approvedRequests.length > 1 && 's'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Pie Chart for approved expenses */}
                                    {dept.approvedRequests?.length > 0 && (
                                        <div className="relative z-10 overflow-visible flex justify-end">
                                            <PieChart width={90} height={90}>
                                                <Pie
                                                    data={dept.approvedRequests.map((req, index) => ({
                                                        name: req.description,
                                                        value: parseFloat(req.amount),
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={20}
                                                    outerRadius={30}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {dept.approvedRequests.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />

                                            </PieChart>
                                        </div>
                                    )}
                                </footer>

                            </div>
                        </article>
                    );
                })}
            </section>

            {/* ─── DETAILS PANEL ───────────────────────────────────────── */}
            {selectedDept && (
                <section className="mt-14 mx-auto w-full">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleDownloadExcel}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                        >
                            Download Excel Report
                        </button>
                    </div>
                    <div className="rounded-2xl bg-white/70 backdrop-blur p-8 shadow-lg">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-8">
                            Details for <span className="text-indigo-800">{selectedDept.department}</span>
                        </h2>

                        {/* ─ Approved Requests ─ */}
                        <div className="mb-12">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700">
                                Approved Requests
                                <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-600">
                                    {selectedDept.approvedRequests?.length || 0}
                                </span>
                            </h3>

                            {selectedDept.balanceHistory?.length ? (
                                <ul className="space-y-4">
                                    {selectedDept.balanceHistory.filter((req) => req.type === "expense").map((req, idx) => (
                                        <li
                                            key={idx}
                                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="font-medium text-slate-700">{req.description}</p>
                                                <p className="text-sm font-bold text-emerald-600">
                                                    ₹{Number(req.amount).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-sm text-slate-600 space-y-2">
                                                {/* <p><span className="font-semibold text-slate-800">Description</span> {req.description}</p> */}
                                                <p>
                                                    <span className="font-semibold text-slate-800">Approved By: </span>
                                                    {managerMapping[req.approvedBy._id] || "Unknown Manager"}
                                                </p>
                                                <p><span className="font-semibold text-slate-800">Balance Before Approval:</span> ₹{Number(req.balanceBefore).toLocaleString()}</p>
                                                <p><span className="font-semibold text-slate-800">Balance After Approval:</span> ₹{Number(req.balanceAfter).toLocaleString()}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500">No approved requests found.</p>
                            )}
                        </div>


                        {/* ─ Funds Disbursed ─ */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700">
                                Funds Disbursed
                                <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-600">
                                    {selectedDept.fundsDisbursed[0]?.refillAmountHistory?.length || 0}
                                </span>
                            </h3>

                            {selectedDept.fundsDisbursed?.length ? (
                                <ul className="space-y-4">
                                    {selectedDept.fundsDisbursed.map((fund, idx) => (
                                        <li
                                            key={idx}
                                            className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                                                    ₹{Number(fund.refillAmount).toLocaleString()}
                                                </p>
                                                <p className="flex items-center gap-1 text-sm text-slate-600">
                                                    {new Date(fund.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                    })}
                                                </p>
                                            </div>

                                            <div className="pl-3">
                                                <p className="text-xs text-slate-500 font-semibold mb-1">Refill History:</p>
                                                <ul className="space-y-1">
                                                    {fund.refillAmountHistory.map((entry, i) => (
                                                        <li
                                                            key={entry._id || i}
                                                            className="text-xs text-slate-600 flex justify-between"
                                                        >
                                                            <span>₹{Number(entry.amount).toLocaleString()}</span>
                                                            <span>
                                                                {new Date(entry.date).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                })}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500">No disbursed funds found.</p>
                            )}
                        </div>

                    </div>
                </section>
            )}
        </div>
    );
};

export default Ledger;