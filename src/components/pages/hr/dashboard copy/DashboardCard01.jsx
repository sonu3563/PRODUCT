import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { StatCardHeader } from "../../../components/CardsDashboard";
import { Briefcase } from "lucide-react";
import { API_URL } from "../../../utils/ApiConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardCard01 = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchDepartmentUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/getuser-Byteam`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (json.success && json.data) {
          setLabels(Object.keys(json.data).map(key => key.replace(' Users', '')));
          setData(Object.values(json.data));
        }
      } catch (error) {
        console.error('Error fetching department user data:', error);
      }
    };

    fetchDepartmentUsers();
  }, [token]);

  // Dynamically calculate suggestedMax
  const highest = Math.max(...data, 0); // fallback to 0 if empty
  const suggestedMax = highest > 50 ? highest + 10 : 50;

  return (
    <div className="col-span-2 sm:col-span-6 xl:col-span-7 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col border border-gray-200">
      <StatCardHeader icon={Briefcase} title="Total employees in department" tooltip="Total employees in department." />
      <div className="p-5 h-96 flex items-center justify-center">
        {labels.length > 0 && data.length > 0 ? (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: 'Employees',
                  data,
                  backgroundColor: [
                    '#2563eb',
                    '#10b981',
                    '#f59e0b',
                    '#ec4899',
                    '#8b5cf6',
                  ],
                  borderRadius: 8,
                  barPercentage: 0.55,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: '#9ca3af',
                    font: {
                      size: 12,
                      weight: '600',
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.label}: ${Math.round(context.raw)} employees`,
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: '#9ca3af',
                    font: {
                      size: 12,
                    },
                  },
                  grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                  },
                },
                y: {
                  suggestedMax,
                  ticks: {
                    color: '#9ca3af',
                    font: {
                      size: 12,
                    },
                    callback: function (value) {
                      return Number.isInteger(value) ? value : '';
                    },
                  },
                  grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                  },
                },
              },
            }}
          />
        ) : (
          <p className="text-gray-400 text-sm">Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard01;
