import React, { useState, useEffect, useContext } from 'react'; 
import BarChart from '../../../charts/BarChart01';
import { GraphContext } from '../../../context/GraphContext';
import { StatCardHeader } from "../../../components/CardsDashboard";
import { Briefcase } from "lucide-react";
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
 
   return (
     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-7 bg-white  ring shadow-xl ring-gray-100 rounded-lg">
       <StatCardHeader icon={Briefcase} title="Weekly status" tooltip="Weekly status" />
       {/* Check if data is available */}
       {loading ? (
         <p>Loading...</p>
       ) : (
         // Ensure chart data is not empty before passing to BarChart
         chartData.labels.length > 0 ? (
           <BarChart data={chartData} width={595} height={248} />
         ) : (
           <p>No data available for the selected week</p>
         )
       )}
     </div>
   );
 }
 
 export default DashboardCard04;
 