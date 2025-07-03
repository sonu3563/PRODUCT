import React, { useState, useEffect, useCallback } from 'react';
import { useLeave } from '../../../context/LeaveContext';
import { Calendar, Clock, FileText, Type, CheckCircle, XCircle, Clock3, Search, Loader2 } from 'lucide-react';
import { SectionHeader } from '../../../components/SectionHeader';
import { useAlert } from "../../../context/AlertContext";
import Pagination from "../../../components/Pagination"; // Assuming this path is correct

function LeaveForm() {
  const [leaveType, setLeaveType] = useState('');
  const [showHours, setShowHours] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [searchTerm, setSearchTerm] = useState(''); // State for table search
  const [filterStatus, setFilterStatus] = useState("All"); // State for filtering by status: "All", "Pending", "Approved", "Rejected"
  const [filteredLeaves, setFilteredLeaves] = useState([]); // State for filtered table data

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this number

  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    leave_type: '',
    hours: '',
    reason: '',
    status: 'Pending',
  });

  const { leaves, addLeave, loading, error, fetchLeaves } = useLeave();

  // Effect to fetch leaves when the component mounts
  useEffect(() => {
    fetchLeaves();
  }, []);

  // Memoize the filter function for performance
  const applyFilters = useCallback(() => {
    let currentFilteredData = leaves || [];

    // Apply search term filter
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentFilteredData = currentFilteredData.filter(leave => {
        const startDate = leave.start_date ?? '';
        const endDate = leave.end_date ?? '';
        const leaveTypeVal = leave.leave_type ?? '';
        const reason = leave.reason ?? '';
        const hours = (leave.hours !== null && leave.hours !== undefined) ? String(leave.hours) : '';
        const status = leave.status ?? '';

        return (
          startDate.toLowerCase().includes(lowercasedSearchTerm) ||
          endDate.toLowerCase().includes(lowercasedSearchTerm) ||
          leaveTypeVal.toLowerCase().includes(lowercasedSearchTerm) ||
          reason.toLowerCase().includes(lowercasedSearchTerm) ||
          hours.includes(lowercasedSearchTerm) ||
          status.toLowerCase().includes(lowercasedSearchTerm)
        );
      });
    }

    // Apply status filter
    if (filterStatus !== "All") {
      currentFilteredData = currentFilteredData.filter(leave =>
        (leave.status || '').toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredLeaves(currentFilteredData);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [searchTerm, filterStatus, leaves]); // Dependencies updated to include filterStatus

  // Run filter function whenever searchTerm, filterStatus, or leaves changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Effect to manage form fields visibility based on selected leave type
  useEffect(() => {
    if (leaveType === 'Short Leave') {
      setShowHours(true);
      setShowEndDate(false);
      setFormData(prev => ({ ...prev, end_date: '' }));
    } else if (leaveType === 'Multiple Days Leave') {
      setShowHours(false);
      setShowEndDate(true);
      setFormData(prev => ({ ...prev, hours: '' }));
    } else {
      setShowHours(false);
      setShowEndDate(false);
      setFormData(prev => ({ ...prev, end_date: '', hours: '' }));
    }
    setFormData(prev => ({ ...prev, leave_type: leaveType }));
  }, [leaveType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');

    if (!token) {
      showAlert({ variant: "error", title: "Error", message: "User not authenticated" });
      return;
    }

    const leaveDataToSubmit = {
      start_date: formData.start_date,
      leave_type: formData.leave_type,
      reason: formData.reason,
    };

    if (formData.leave_type === 'Multiple Days Leave') {
      leaveDataToSubmit.end_date = formData.end_date;
    }
    if (formData.leave_type === 'Short Leave') {
      leaveDataToSubmit.hours = formData.hours;
    }

    // Basic client-side validation
    if (!leaveDataToSubmit.start_date || !leaveDataToSubmit.leave_type || !leaveDataToSubmit.reason) {
      showAlert({ variant: "warning", title: "Warning", message: "Please fill in all required fields (Start Date, Leave Type, Reason)." });
      return;
    }
    if (leaveDataToSubmit.leave_type === 'Multiple Days Leave' && !leaveDataToSubmit.end_date) {
      showAlert({ variant: "warning", title: "Warning", message: "Please select an End Date for Multiple Days Leave." });
      return;
    }
    if (leaveDataToSubmit.leave_type === 'Short Leave' && !leaveDataToSubmit.hours) {
      showAlert({ variant: "warning", title: "Warning", message: "Please specify the Number of Hours for Short Leave." });
      return;
    }

    console.log('Submitting Leave Data:', leaveDataToSubmit);

    try {
      const response = await addLeave(leaveDataToSubmit, token);
      console.log('API Response:', response);

      if (response) {
        showAlert({ variant: "success", title: "Success", message: "Leave request submitted successfully" });
        setFormData({
          start_date: '',
          end_date: '',
          leave_type: '',
          hours: '',
          reason: '',
          status: 'Pending',
        });
        setLeaveType('');
        setIsModalOpen(false); // Close the modal
        fetchLeaves(); // Re-fetch leaves to update the table
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      showAlert({ variant: "error", title: "Error", message: "Failed to submit leave request." });

    }
  };

  const getStatusBadge = (status) => {
    const lowerStatus = (status || '').toLowerCase();

    switch (lowerStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock3 className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

  // Apply pagination to filtered data
  const paginatedLeaveRequests = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <>
      <SectionHeader icon={Calendar} title="Leave Request" subtitle="Employee Leave Request" />

      {/* Action bar with Add Leave button, Status Filters, and Search */}
      <div className='flex flex-col md:flex-row justify-between items-center px-4 py-3 gap-3'>
        <button
          className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto'
          onClick={() => setIsModalOpen(true)}
        >
          Add Leave
        </button>

        {/* Search Input */}
        <div className="relative w-full md:w-auto flex-1 max-w-md">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="Search by Date, Type, Reason, or Hours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
         {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
          <button
            className={`p-2 border rounded-lg ${
              filterStatus === "All" ? "import-btn" : "import-btn"
            } transition-colors duration-200`}
            onClick={() => setFilterStatus("All")}
          >
            All
          </button>
          <button
            className={`p-2 border rounded-lg ${
              filterStatus === "Pending" ? "weekly-btn" : "weekly-btn"
            } transition-colors duration-200`}
            onClick={() => setFilterStatus("Pending")}
          >
            Pending
          </button>
          <button
            className={`p-2 border rounded-lg ${
              filterStatus === "Approved" ? "export-btn" : "export-btn"
            } transition-colors duration-200`}
            onClick={() => setFilterStatus("Approved")}
          >
            Approved
          </button>
          <button
            className={`p-2 border rounded-lg ${
              filterStatus === "Rejected" ? "custom-btn" : "custom-btn"
            } transition-colors duration-200`}
            onClick={() => setFilterStatus("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Inline Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            onClick={() => setIsModalOpen(false)} // Close modal when clicking on the overlay
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-xl p-6 m-4 max-w-lg w-full z-50 transform transition-all sm:my-8 sm:align-middle">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800" id="modal-title">
                Apply for Leave
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Leave Form */}
            <div className="py-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Start Date & End Date */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className={`relative ${showEndDate ? 'sm:w-6/12' : 'sm:w-full'} w-full`}>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                    />
                  </div>

                  {showEndDate && (
                    <div className="relative w-full sm:w-6/12">
                      <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        End Date
                      </label>
                      <input
                        type="date"
                        id="end-date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                      />
                    </div>
                  )}
                </div>

                {/* Leave Type & Hours */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className={`relative ${showHours ? 'sm:w-6/12' : 'sm:w-full'} w-full`}>
                    <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Type className="w-4 h-4 mr-2 text-gray-400" />
                      Leave Type
                    </label>
                    <div className="relative">
                      <select
                        id="leave-type"
                        name="leave_type"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
                      >
                        <option value="">Select Leave Type</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Full Leave">Full Day</option>
                        <option value="Short Leave">Short Leave</option>
                        <option value="Multiple Days Leave">Multiple Days Leave</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {showHours && (
                    <div className="relative w-full sm:w-6/12">
                      <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        Number of Hours
                      </label>
                      <input
                        type="text"
                        id="hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        placeholder='e.g., 3pm to 6pm or 4'
                        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                      />
                    </div>
                  )}
                </div>

                {/* Leave Reason */}
                <div className="relative">
                  <label htmlFor="leave-reason" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    Leave Reason
                  </label>
                  <textarea
                    id="leave-reason"
                    name="reason"
                    rows="4"
                    value={formData.reason}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-none"
                    placeholder="Please provide a detailed reason for your leave request..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-3" /> Submitting...
                    </span>
                  ) : (
                    'Submit Leave Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table for Leave Records */}
      <div className="mt-4 w-full max-w-full mx-auto px-4 ">
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-blue-600">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Start Date
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    End Date
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <Type className="w-4 h-4 mr-2" />
                    Leave Type
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Reason
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Hours
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-blue-600">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Loading leave records...</span>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              )}
              {!loading && !error && paginatedLeaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    {searchTerm || filterStatus !== "All" ? "No matching leave records found for your search/filter." : "No leave records to display."}
                  </td>
                </tr>
              ) : (
                paginatedLeaveRequests.map((leave) => (
                  <tr
                    key={leave.id || `${leave.start_date}-${leave.leave_type}-${leave.reason}`}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {formatDate(leave.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {formatDate(leave.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {leave.leave_type || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {leave.reason || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      {(leave.hours !== null && leave.hours !== undefined) ? leave.hours : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Component */}
          <div className="p-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaveForm;