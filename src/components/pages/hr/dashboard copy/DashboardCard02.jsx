import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../utils/ApiConfig';
import { StatCardHeader } from "../../../components/CardsDashboard";
import { CalendarDays } from "lucide-react";


const DashboardCard02 = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const response = await fetch(`${API_URL}/api/getall-leave-forhr`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        if (json.success && json.data) {
          // Sort by created_at in descending order and take the latest 5
          const sortedLeaves = json.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          setLeaves(sortedLeaves);
        }
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="col-span-full shadow-lg rounded-lg xl:col-span-6 bg-white shadow-xs rounded-xl">
      <StatCardHeader icon={CalendarDays} title="Recent Leaves" tooltip="Recent Leaves" />
      <div className="p-3">
        <div className="overflow-auto max-h-[50vh]">
          <table className="table-auto w-full">
            <thead className="text-xs uppercase text-white sticky top-0">
              <tr className='bg-blue-600 rounded-lg'>
                <th className="p-3 text-left">Employee Name</th>
                <th className="p-3 text-center">Leave Type</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Created Date</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 text-gray-800 ">
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="p-3">{leave.user_name}</td>
                    <td className="p-3 text-center">{leave.leave_type}</td>
                    <td className="p-3 text-center">
                      {leave.leave_type === "Short Leave"
                        ? `${leave.hours} hours`
                        : `${leave.start_date} to ${leave.end_date}`}
                    </td>
                    <td className="p-3 text-center">
                      {leave.status === "Approved" ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border border-green-400">
                          {leave.status}
                        </span>
                      ) : leave.status === "Pending" ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border border-yellow-400">
                          {leave.status}
                        </span>
                      ) : leave.status === "Rejected" ? (
                        <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border border-red-400">
                          {leave.status}
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3 text-center">
                     {new Date(leave.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No recent leaves found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard02;
