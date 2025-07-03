import React, { useState, useEffect, useContext } from 'react'; 
import DoughnutChart from '../../../charts/DoughnutChart';
import { GraphContext } from '../../../context/GraphContext';
import { StatCardHeader } from "../../../components/CardsDashboard";
import { Briefcase } from "lucide-react";

import { getCssVariable } from '../Dashutils/Utils';

function DashboardCard06() {
  const { loading, error, fetchEmpHours, empHours } = useContext(GraphContext);
  console.log("Graph Data Received:", empHours);

  useEffect(() => {

      fetchEmpHours();

  }, []);

  const timeToDecimal = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  const safeGetCssVariable = (variable, fallback) => getCssVariable(variable) || fallback;

  const filteredChartData = empHours
    ? {
        labels: ['Billable Hours', 'Non-billable Hours', 'In-house Hours'],
        datasets: [
          {
            label: 'Working Hours',
            data: [
              timeToDecimal(empHours.total_billable),
              timeToDecimal(empHours.total_non_billable),
              timeToDecimal(empHours.total_inhouse),
            ],
            backgroundColor: [
              safeGetCssVariable('--color-violet-500', '#8b5cf6'),
              safeGetCssVariable('--color-sky-500', '#0ea5e9'),
              safeGetCssVariable('--color-violet-800', '#6d28d9'),
            ],
            hoverBackgroundColor: [
              safeGetCssVariable('--color-violet-600', '#7c3aed'),
              safeGetCssVariable('--color-sky-600', '#0284c7'),
              safeGetCssVariable('--color-violet-900', '#4c1d95'),
            ],
            borderWidth: 1,
          },
        ],
      }
    : null; 

  console.log("Filtered Chart Data:", filteredChartData);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-5 bg-white ring shadow-xl ring-gray-100 rounded-lg">
      <StatCardHeader icon={Briefcase} title="Working hours" tooltip="Working hours" />
      
      {loading && <p>Loading data...</p>}
      {error && <p>Error: {error.message || "An unknown error occurred"}</p>}

      {filteredChartData ? (
        <DoughnutChart data={filteredChartData} width={389} height={260} />
      ) : (
        <p>No data available for the selected date range</p>
      )}
    </div>
  );
}

export default DashboardCard06;
