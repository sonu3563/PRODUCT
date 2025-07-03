import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { API_URL } from "../../../utils/ApiConfig";
import { StatCardHeader } from "../../../components/CardsDashboard";
import { SectionHeader } from '../../../components/SectionHeader';
import {Briefcase,BarChart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
// import TaskList from '../../Pm/Tasks/Task';
import TaskList from '../../Pm/Tasks/Task';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export const ProjectDetail = () => {
  const { project_id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const authToken = localStorage.getItem('userToken');
        const response = await fetch(`${API_URL}/api/getfull-projectmananger-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        });

        const data = await response.json();
        console.log('URL param project_id:', project_id);
        console.log('API response:123', data);

        if (data.success) {
          const matchedProject = data.data.find(
            (proj) => String(proj.project_id) === String(project_id)
          );
          setProject(matchedProject || null);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [project_id]);

  if (loading) return <div className="text-center text-xl p-10">Loading...</div>;
  if (!project) return <div className="text-center text-red-600 text-xl p-10">Project not found.</div>;

  const gototask = () => {
  navigate(`/superadmin/tasks/${project.project_id}`);
};

  return (
     <>
    <SectionHeader icon={BarChart} title="Projects Detail" subtitle="Project detail page" />
    <div className="max-w-full shadow bg-gray-100 min-h-screen space-y-8">
      <div className="bg-white  rounded-lg p-6 space-y-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Project name : {project.project_name}</h2>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"> */}
                  <div className="">
          {project.project_managers.map((manager, i) => {
            const pieData = {
              labels: ['Total Hours', 'Worked Hours', 'Remaining Hours'],
              datasets: [
                {
                  label: 'Project Hours',
                  data: [project.total_hours, project.worked_hours, project.remaining_hours],
                  backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                },
              ],
            };

            return (
              <div key={i} className="">
                <StatCardHeader icon={Briefcase} title="Project Detail" tooltip="Project Detail" />
             
               <div className='border rounded'>
               <div className="flex justify-between flex-wrap gap-4 bg-white p-4 border">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Manager</h2>
                    {/* <hr /> */}
                    <p className='font-bold '>Name : {manager.name}</p>
                    <p className='font-bold '>Email : <a className="underline " href={`mailto:${manager.email}`}>{manager.email}</a></p>
                    <p className='font-bold '>Project : {project.project_name}</p>
                    {/* <p className='font-bold '>Project : {project.project_name}</p> */}
                  </div>
                  <div>
                    <h2 className="text-xl text-white font-bold mb-2">Hours</h2>
                    {/* <hr /> */}
                    <p className=" font-bold">Total: {project.total_hours}</p>
                    <p className=" font-bold">Worked: {project.worked_hours}</p>
                    <p className=" font-bold">Remaining: {project.remaining_hours}</p>
                  </div>
                </div>
                <div className="w-full h-64 mt-4 mb-5">
                  <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
               </div>
              
             <div className='pt-5'>
               {/* <TaskList show={show} /> */}
               </div>
              </div>

              
            );
          })}
        </div>

        {project.project_managers.map((manager, idx) => {
          if (!manager.users || manager.users.length === 0) return null;

          const workedData = {
            labels: manager.users.map((u) => u.name),
            datasets: [
              {
                label: 'Worked Hours',
                data: manager.users.map((u) => u.worked_hours),
                backgroundColor: ['#6366f1', '#22c55e', '#f97316', '#ec4899'],
              },
            ],
          };

          // const usersWithRemaining = manager.users.filter(
          //   (u) => project.total_hours - u.worked_hours > 0
          // );

          return (
            <div key={idx} className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Users Under {manager.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="w-full h-64 bg-gray-100 rounded p-4">
                  <Bar data={workedData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>  <div className="w-full h-64 bg-gray-100 rounded p-4">
                  <Bar data={workedData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>

                {/* Worked hours chart + user list */}
                <div>
                  <ul>
                    {manager.users.map((user) => (
                      <li key={user.id} className="bg-blue-500 p-3 rounded mb-3 font-bold text-white">
                        <p>Name: {user.name}</p>
                        <p>Email: <a className="underline" href={`mailto:${user.email}`}>{user.email}</a></p>
                        <p>Worked Hours: {user.worked_hours}</p>
                        <p>Remaining Hours: {project.total_hours - user.worked_hours}</p>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
     </>
  );
};
