import React from 'react';
import { useProject } from "../../../context/ProjectContext";
import { useClient } from "../../../context/ClientContext";
import { StatCardHeader } from "../../../components/CardsDashboard";
import { CheckCircle, XCircle, Pencil, Ban, Save, Edit, CalendarDays, Trash2, Eye, UserPlus, FolderSync, Briefcase } from "lucide-react";

function DashboardCard07() {
  const { projects, isLoading } = useProject();
  const { clients } = useClient(); // Assuming you have client data

  console.log("dash projects", projects);
  // Helper function to get client name by ID
  const latestProjects = projects
  .slice() // Create a copy to avoid mutating original array
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest date
  .slice(0, 7);

  return (
    <div className="col-span-full shadow-lg rounded-lg xl:col-span-7 bg-white shadow-xs rounded-xl">
      {/* <header className="px-5 pt-2 pb-2 ">
        <h2 className="font-semibold mb-2 text-2xl ">Recent Projects</h2>
        <hr />
      </header> */}
      <StatCardHeader icon={Briefcase} title="Recent Projects" tooltip="Recent Projects." />
      <div className="p-3">
        {/* Table */}
        <div className="overflow-auto max-h-[50vh]">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-white sticky top-0">
              <tr className='bg-gray-600 rounded-lg'>
                <th className="p-3 ">
                  <div className="font-semibold text-left">Client Name</div>
                </th>
                <th className="p-3">
                  <div className="font-semibold text-center">Project Name</div>
                </th>
                <th className="p-3">
                  <div className="font-semibold text-center">Created Date</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 ">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center">Loading...</td>
                </tr>
              ) : latestProjects.length > 0 ? (
                latestProjects.map((project) => (
                  <tr key={project.id} className='odd:bg-gray-50 hover:bg-gray-100'>
                    <td className="p-2">
                      <div className="text-gray-800 ">
                        {project.client?.name || "Unknown Client"}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">{project.project_name}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">
                        {new Date(project.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center">No projects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
