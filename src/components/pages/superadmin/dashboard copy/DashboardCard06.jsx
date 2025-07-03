import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { API_URL } from "../../../utils/ApiConfig";
import { StatCardHeader } from "../../../components/CardsDashboard";
import { CheckCircle, XCircle, Pencil, Ban, Save, Edit, CalendarDays, Loader2, BarChart, Search, Trash2, Eye, UserPlus, FolderSync, Briefcase } from "lucide-react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardCard06 = () => {
  const [chartData, setChartData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchDepartmentProjects = async () => {
      if (!token) {
        setErrorMsg('User token not found in localStorage.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/total-departmentproject`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log("API response:", json);

        if (json.success && json.data) {
          const labels = Object.keys(json.data);
          const data = Object.values(json.data);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Projects per Department',
                data,
                backgroundColor: [
                  '#3b82f6',
                  '#10b981',
                  '#f59e0b',
                  '#ec4899',
                  '#8b5cf6',
                  '#ef4444',
                ],
                borderWidth: 1,
              },
            ],
          });
        } else {
          setErrorMsg("API returned success: false or missing data.");
        }
      } catch (error) {
        console.error('Error fetching department project data:', error);
        setErrorMsg(error.message);
      }
    };

    fetchDepartmentProjects();
  }, [token]);

  const projectOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="col-span-12 xl:col-span-5 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col border border-gray-200">
      <StatCardHeader icon={Briefcase} title="Total Projects in Department" tooltip="Total Projects in Department." />
      <div className="p-6 h-96 flex justify-center items-center">
        {errorMsg ? (
          <p className="text-red-500">{errorMsg}</p>
        ) : chartData ? (
          <Pie data={chartData} options={projectOptions} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard06;
