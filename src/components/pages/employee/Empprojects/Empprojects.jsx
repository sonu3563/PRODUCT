import React, { useEffect } from 'react';
import { Calendar, Users, FileText,BarChart, Briefcase, ArrowUpRight, Clock } from 'lucide-react';
import { useUserContext } from '../../../context/UserContext';
import { useNavigate } from "react-router-dom";
import { SectionHeader } from '../../../components/SectionHeader';

function ProjectCard({ project }) {
    const navigate = useNavigate(); 
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
              {project.project_name}
            </h3>
            <div className="flex items-center text-gray-600 bg-gray-50 rounded-full px-3 py-1 w-fit">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium text-sm text-blue-600">{project.client?.name || 'Unknown Client'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2" onClick={() => navigate(`/team/tasks/${project.id}`)}>
            <span className="task-btn">
              Tasks
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-gray-600 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
            <Calendar className="w-5 h-5 mr-3 text-blue-500" />
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Assigned Date</div>
              <span className="font-semibold text-gray-700">
                {new Date(project.pivot?.assigned_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
            <Clock className="w-5 h-5 mr-3 text-red-500" />
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Deadline</div>
              <span className="font-semibold text-gray-700">
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'No deadline specified'}
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center text-gray-600 mb-3">
              <FileText className="w-5 h-5 mr-3 text-blue-500" />
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project Requirements</div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-8 group-hover:text-gray-900 transition-colors duration-300">
              {project.requirements || 'No requirements specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { userassignedProjects, fetchUserassignedProjects } = useUserContext();

  useEffect(() => {
    fetchUserassignedProjects();
  }, []);

  console.log("User Assigned Projects:", userassignedProjects);

  return (
    <>
      <SectionHeader icon={BarChart} title="Projects Assigned" subtitle="Track and manage your assigned projects efficiently with our intuitive dashboard." />
    <div className="w-screen-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(userassignedProjects) && userassignedProjects.length > 0 ? (
            userassignedProjects.map(project => <ProjectCard key={project.id} project={project} />)
          ) : (
            <p className="text-center col-span-3 text-gray-500">No projects assigned yet.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
