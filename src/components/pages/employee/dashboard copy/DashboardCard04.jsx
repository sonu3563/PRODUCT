import React, { useState, useEffect, useContext } from 'react';
import BarChart from '../../../charts/BarChart01';
import { GraphContext } from '../../../context/GraphContext';
import { StatCardHeader } from "../../../components/CardsDashboard";
import { Briefcase, Loader2 } from "lucide-react"; // Added Loader2 icon
// Import utilities
import { getCssVariable } from '../Dashutils/Utils';

function DashboardCard04() {
  const { loading, error, fetchempweekhours, empweekhours } = useContext(GraphContext);

  // Function to convert time (HH:MM) to decimal hours
  const timeToDecimal = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  useEffect(() => {
    fetchempweekhours(); // Fetch data when component mounts
  }, []);

  // Log to verify if data is being fetched correctly
  console.log("weekly hours", empweekhours);

  // Prepare chart data if weeklyWorkingHours data is available
  const chartData = {
    labels: (empweekhours && empweekhours.length > 0)
      ? empweekhours.map(item => item.date)
      : [],
    datasets: [
      {
        label: 'Billable Hours',
        data: (empweekhours && empweekhours.length > 0)
          ? empweekhours.map(item => timeToDecimal(item.total_billable))
          : [],
        backgroundColor: getCssVariable('--color-sky-500'),
        hoverBackgroundColor: getCssVariable('--color-sky-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      {
        label: 'Non-Billable Hours',
        data: (empweekhours && empweekhours.length > 0)
          ? empweekhours.map(item => timeToDecimal(item.total_non_billable))
          : [],
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      {
        label: 'In-House Hours',
        data: (empweekhours && empweekhours.length > 0)
          ? empweekhours.map(item => timeToDecimal(item.total_inhouse))
          : [],
        backgroundColor: getCssVariable('--color-green-500'),
        hoverBackgroundColor: getCssVariable('--color-green-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  // Check if any dataset has positive data to display a meaningful chart
  const hasChartData = chartData.datasets.some(dataset => dataset.data.some(val => val > 0));

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-blue-200">
      <StatCardHeader icon={Briefcase} title="Weekly Status" tooltip="Displaying your weekly working hours breakdown." />
      
      {/* Content area for chart or messages */}
      <div className="">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-gray-600 py-8">
            <Loader2 className="h-14 w-14 animate-spin text-gray-500" />
            <span className="text-xl font-semibold">Loading weekly data...</span>
            <span className="text-base text-gray-500">Fetching your weekly hour breakdown.</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-3 text-red-700 py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-semibold">Oops! Error loading chart.</span>
            <span className="text-base text-red-600">Details: {error.message || "An unknown error occurred."}</span>
            <span className="text-sm text-gray-500">Please try again later.</span>
          </div>
        ) : chartData.labels.length > 0 && hasChartData ? (
          <BarChart data={chartData} width={595} height={248} />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 text-gray-500 py-8">
            <Briefcase className="h-14 w-14 text-gray-400 opacity-70" />
            <span className="text-xl">No weekly data available.</span>
            <span className="text-base text-gray-600">It looks like there's no activity to display for this week.</span>
            <span className="text-sm text-gray-500">Log your hours to see your weekly progress!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard04;