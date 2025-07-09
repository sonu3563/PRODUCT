import React, { useState, useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
import {
  Loader2,
  Calendar,
  User,
  Briefcase,
  Clock,
  FileText,
  Target,
  CheckCircle,
  BarChart,
  Search,
  Save,
  XCircle,
  Pencil,
  Trash2,
  Edit,
} from "lucide-react";
import { SectionHeader } from "../../../components/SectionHeader";
import { useAlert } from "../../../context/AlertContext";

export const EmpSheetHistory = () => {
  const { userProjects, error, editPerformanceSheet, performanceSheets, loading, fetchPerformanceSheets } = useUserContext();
  console.log("Performance Sheets:", performanceSheets); // Debugging: Check the structure

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const sheets = performanceSheets?.data?.sheets || [];
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState([]);
  const { showAlert } = useAlert();
  const recordsPerPage = 11;

  // Effect to set initial tags when userProjects are loaded, or when entering edit mode
  useEffect(() => {
    if (editingRow !== null && sheets[editingRow] && userProjects?.data) {
      const currentSheet = sheets[editingRow];
      const selectedProject = userProjects.data.find(
        (project) => project.id === parseInt(currentSheet.project_id)
      );
      if (selectedProject) {
        setTags(selectedProject.tags_activitys);
      } else {
        setTags([]); // Clear tags if project not found
      }
    }
  }, [editingRow, sheets, userProjects]);
  useEffect(() => {
    fetchPerformanceSheets();
  }, []);

  const handleEditClick = (index, sheet) => {
    setEditingRow(index);
    // When entering edit mode, set editedData.activity_type to the ID
    // so the <select> element can correctly display the current activity type.
    const currentActivityTag = tags.find(
      (tag) => tag.name === sheet.activity_type
    );
    setEditedData({
      ...sheet,
      activity_type: currentActivityTag ? currentActivityTag.id : sheet.activity_type,
    });

    // Also set tags relevant to the current project being edited
    if (userProjects?.data) {
      const selectedProject = userProjects.data.find(
        (project) => project.id === parseInt(sheet.project_id)
      );
      if (selectedProject) {
        setTags(selectedProject.tags_activitys);
      } else {
        setTags([]);
      }
    }
  };

  const handleChange = (e, field) => {
    let value = e.target.value;

    // For time field, clean up any AM/PM if mistakenly entered
    if (field === "time") {
      value = value.replace(/(AM|PM|am|pm)/gi, "").trim();
    }

    console.log(`Updating ${field}:`, value);

    // If the field is "project_id", update the tags state based on the selected project
    if (field === "project_id") {
      const selectedProject = userProjects.data.find(
        (project) => project.id === parseInt(value)
      );
      if (selectedProject) {
        setTags(selectedProject.tags_activitys);
      } else {
        setTags([]); // Clear tags if no project selected or found
      }
    }

    setEditedData((prevData) => ({ ...prevData, [field]: value }));
  };

  const ActivityTypeStatus = (ActivityType) => {
     const activitytype = (ActivityType || "").toLowerCase();
    switch(activitytype){
      case "billable" :
        return "bg-green-50 text-green-700 ring-1 ring-green-600/20 px-2 py-1 rounded-full text-xs font-medium ";
      case "non billable":
        return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 px-2 py-1 rounded-full text-xs font-medium"
    }
  }

  const handleSave = async (editId) => {
    if (!editId) {
      console.error("No ID provided for the sheet being edited.");
      return;
    }

    // Find the name of the activity type based on its ID before sending
    const selectedTag = tags.find(
      (tag) => tag.id.toString() === editedData.activity_type.toString()
    );
    const activityTypeName = selectedTag ? selectedTag.name : editedData.activity_type;

    const requestData = {
      id: editId,
      data: {
        project_id: editedData.project_id,
        date: editedData.date,
        time: editedData.time,
        work_type: editedData.work_type,
        activity_type: activityTypeName, // Send the name, not the ID
        narration: editedData.narration,
        project_type: editedData.project_type,
        project_type_status: editedData.project_type_status,
      },
    };

    try {
      const response = await editPerformanceSheet(requestData);
      if (response) {
        setEditingRow(null); // Exit edit mode on success
        // Assuming editPerformanceSheet in context either updates local state
        // or triggers a re-fetch of performance sheets.
        // If not, you might need to manually update the 'sheets' state here
        // or trigger a refetch from the UserContext.
      }
    } catch (error) {
      console.error("Error saving performance sheet:", error);
      // Optionally, show an error message to the user
    }
  };

  // --- Start of fix for toLowerCase error ---
  const getStatusStyles = (status) => {
    // Ensure status is always a string, defaulting to an empty string if null/undefined
    const safeStatus = (status || "").toLowerCase();

    switch (safeStatus) {
      case "rejected":
        return "bg-red-50 text-red-700 ring-1 ring-red-600/20 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      case "pending":
        return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      case "approved":
      case "completed":
        return "bg-green-50 text-green-700 ring-1 ring-green-600/20 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      default:
        // return "bg-gray-50 text-gray-700 ring-1 ring-gray-700/20 hover:bg-gray-100 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
        return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
      }
  };

  const getStatusIcon = (status) => {
    // Ensure status is always a string, defaulting to an empty string if null/undefined
    const safeStatus = (status || "").toLowerCase();

    switch (safeStatus) {
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  // --- End of fix for toLowerCase error ---

  const filteredSheets = sheets.filter((sheet) => {
    const sheetDate = new Date(sheet.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || sheetDate >= start) && (!end || sheetDate <= end)
    );
  });

  const totalPages = Math.ceil(filteredSheets.length / recordsPerPage);

  // Get current records for the current page
  const currentRecords = filteredSheets.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle pagination click
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <SectionHeader
        icon={BarChart}
        title="Performance History"
        subtitle="Track your professional journey, monitor progress, and review achievements across all your projects and activities."
      />
      <div className="flex items-center justify-end gap-4 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap border p-2 px-3 rounded-lg shadow-md bg-white">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="font-bold text-black">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="font-bold text-black">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="top-tag-bg-color top-tag-size">
              <div className="text-xl font-bold text-white leading-5">
                {sheets.length}
              </div>
              <div className="text-blue-100">Total Records</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="relative z-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-bg-heading">
                {[
                  { label: "Date", icon: Calendar },
                  { label: "Client Name", icon: User },
                  { label: "Project Name", icon: Briefcase },
                  // { label: "Work Type", icon: Target },
                  { label: "Activity", icon: Clock },
                  { label: "Time", icon: Clock },
                  { label: "Project Type", icon: Clock },
                  // { label: "Project Type Status", icon: Clock },
                  { label: "Narration", icon: FileText },
                  { label: "Status", icon: CheckCircle },
                ].map(({ label, icon: Icon }, index) => (
                  <th key={index} className="text-center table-th-tr-row">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-4 w-4 text-white" />
                      <span className="text-gray-900 text-nowrap text-white">
                        {label}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                    Loading...
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((sheet, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out group"
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium text-nowrap text-center">
                      {sheet.date}
                    </td>
                    <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.client_name}
                    </td>
                    <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.project_name}
                    </td>

                    {/* <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.work_type}
                    </td> */}

                    <td className="px-6 py-4 text-nowrap text-center">
                       <span className={ActivityTypeStatus(sheet.activity_type)}>{sheet.activity_type}</span>
                    </td>

                    <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.time}
                    </td>

                    <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.project_type === "Hourly" ? <span className="bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 px-2 py-1 rounded-full text-xs font-medium">{sheet.project_type}</span> : <span className="bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 px-2 py-1 rounded-full text-xs font-medium">{sheet.project_type}</span>}
                    </td>

                    {/* <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.project_type_status}
                    </td> */}

                    <td className="px-6 py-4 text-nowrap text-center relative">
                      <div className="relative inline-block max-w-[150px] group">
                          <span className="cursor-pointer">
                            {sheet.narration && sheet.narration.length > 7
                              ? sheet.narration.slice(0, 7) + "..."
                              : sheet.narration}{" "}
                            {/* Default fallback */}
                          </span>
                          {sheet.narration && sheet.narration.length > 7 && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-auto max-w-[300px] bg-gray-100 text-black text-sm rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-pre-wrap break-words pointer-events-none invisible group-hover:visible">
                              {sheet.narration || "NA"}
                            </div>
                          )}
                        </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* {sheet.status && sheet.status.length > 7 && (
                            <span className={`${getStatusStyles(sheet.status)}`}>
                              {getStatusIcon(sheet.status)}
                              {sheet.status}
                            </span>
                          )} */}
                        <span className={`${getStatusStyles(sheet.status)}`}>
                          {getStatusIcon(sheet.status)}
                          {sheet.status}
                        </span>

                        {
                          sheet.status && sheet.status.toLowerCase() === "rejected" && (
                            <button
                              onClick={() => handleEditClick(index, sheet)}
                              className="edit-btn inline-flex items-center px-3 py-1.5 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                          )
                        }
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10" // Increased colspan to match the number of columns
                    className="px-6 py-20 text-center text-nowrap"
                  >
                    No performance sheets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {editingRow !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-auto max-h-[90vh] relative">
      <h2 className="text-lg font-semibold mb-4">Edit Timesheet Entry</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block mb-1">Project</label>
          <select
            id="projectId"
            name="projectId"
            value={editedData.project_id || ""}
            onChange={(e) => handleChange(e, "project_id")}
            className="w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="">Select Project</option>
            {userProjects?.data?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Work Type</label>
          <select
            id="workType"
            name="workType"
            value={editedData.work_type || ""}
            onChange={(e) => handleChange(e, "work_type")}
            className="w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="">Select Work Type</option>
            <option value="WFO">Work From Office</option>
            <option value="WFH">Work From Home</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Activity Type</label>
          <select
            id="activityType"
            name="activityType"
            value={editedData.activity_type || ""}
            onChange={(e) => handleChange(e, "activity_type")}
            className="w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="">Select Activity</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Time (HH:MM)</label>
          <input
            type="text"
            value={editedData.time || ""}
            onChange={(e) => handleChange(e, "time")}
            className="w-full border rounded px-2 py-1"
            placeholder="HH:MM"
            maxLength={5}
            inputMode="numeric"
            onKeyDown={(e) => {
              const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
              const isNumber = /^[0-9]$/.test(e.key);
              const isColon = e.key === ":";

              if (!isNumber && !isColon && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }

              if (
                e.target.value.length === 2 &&
                isNumber &&
                e.key !== "Backspace" &&
                !e.target.value.includes(":")
              ) {
                e.target.value += ":";
              }
            }}
          />



          
        </div>

        <div>
          <label className="block mb-1">Project Type</label>
          <select
            id="project_type"
            name="project_type"
            value={editedData.project_type || ""}
            onChange={(e) => handleChange(e, "project_type")}
            className="w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="">Select Project Type</option>
            <option value="Fixed">Fixed</option>
            <option value="Hourly">Hourly</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Project Type Status</label>
          <select
            id="project_type_status"
            name="project_type_status"
            value={editedData.project_type_status || ""}
            onChange={(e) => handleChange(e, "project_type_status")}
            className="w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="">Select Status</option>
            {editedData.project_type === "Fixed" ? (
              <option value="Offline">Offline</option>
            ) : (
              <>
                <option value="Tracker">Tracker</option>
                <option value="Offline">Offline</option>
              </>
            )}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block mb-1">Narration</label>
          <textarea
            value={editedData.narration || ""}
            onChange={(e) => handleChange(e, "narration")}
            className="w-full border rounded px-2 py-1 min-h-[60px] max-h-[200px] overflow-auto"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => handleSave(editedData.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => setEditingRow(null)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </div>
      </div>

      <div className="flex justify-center items-center gap-4 py-4">
        <button
          className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
            currentPage === 1
              ? "bg-gray-200 disabled:opacity-50 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 ring-2 ring-blue-400 shadow-md font-semibold"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
              currentPage === page
                ? "bg-blue-600 text-white font-semibold ring-2 ring-blue-400 shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
            currentPage === totalPages
              ? "bg-gray-200 disabled:opacity-50 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 ring-2 ring-blue-400 shadow-md font-semibold"
          }`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmpSheetHistory;