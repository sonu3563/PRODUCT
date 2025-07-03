import React, { useEffect, useState } from "react";
import { useClient } from "../../../context/ClientContext";
import { Edit, Save, Trash2, Loader2, BarChart, Search } from "lucide-react";
import { exportToExcel, importFromExcel, useImportEmployees, fetchGoogleSheetData } from "../../../components/excelUtils";
import { Clients } from './Clients'
import { FaFileExcel, FaGoogle } from "react-icons/fa";
import { SectionHeader } from '../../../components/SectionHeader';
import { EditButton, SaveButton, CancelButton, ClearButton, ImportButton, ExportButton, YesButton, DeleteButton, IconApproveButton, IconRejectButton, IconCancelTaskButton, IconSaveButton, IconDeleteButton, IconEditButton } from "../../../AllButtons/AllButtons";


export const Clienttable = () => {
  const { clients, fetchClients, isLoading, editClient, deleteClient } = useClient();
  const [editClientId, setEditClientId] = useState(null);
  const [editClientName, setEditClientName] = useState("");
  const [edithireId, setEdithireId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [edithirethrough, setEdithirethrough] = useState("");
  const [filterBy, setFilterBy] = useState("name"); // Default filter by name
  const [editContactDetail, setEditContactDetail] = useState("");
  const [showImportOptions, setShowImportOptions] = useState(false); // FIX: Define state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState("Hired on Upwork");
  const [editingClient, setEditingClient] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [importType, setImportType] = useState(null); // Track selected import type
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [deleteclient, setDeleteclient] = useState("");
  const [editid, setEditid] = useState(null);
  //  const { importEmployees } = useImportEmployees(); // ✅ Extract correctly

  console.log("clients fetched", clients);
  useEffect(() => {
    fetchClients();
  }, []);
  console.log("these are", clients);
  const filteredEmployees = clients?.data?.filter((client) => {
    if (!client || !client[filterBy]) return false;

    // Apply search filter
    const matchesSearch = client[filterBy].toString().toLowerCase().includes(searchQuery.toLowerCase());

    // Apply client type filter
    const matchesClientType = client.client_type === selectedClientType;

    return matchesSearch && matchesClientType;
  });


  const clearFilter = () => {
    setSearchQuery("");
    setFilterBy("name");
  };

  // const handleGoogleSheetImport = () => {
  //   if (!googleSheetUrl) {
  //     alert("Please enter a Google Sheets link.");
  //     return;
  //   }
  //   fetchGoogleSheetData(googleSheetUrl, importEmployees);
  // };

  // const handleImport = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   importFromExcel(file, (data) => {
  //     console.log("Imported Data (Before adding to system):", data);
  //     importEmployees(data); // ✅ Add employees to the system
  //   });
  // };



  // const handleEditClick = (client) => {
  //   setEditClientId(client.id);
  //   setEditClientName(client.name);
  //   setEdithireId(client.hire_on_id);
  //   setEdithirethrough(client.hire_through)
  //   setEditContactDetail(client.contact_detail);
  // };

  const handleInputChange = (e, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };


  const handleEditClick = (client) => {
    setEditingClient(client.id);
    setEditedData({
      name: client.name,
      hire_on_id: client.hire_on_id || "",
      hire_through: client.hire_through || "",
      contact_detail: client.contact_detail || "",
      company_name: client.company_name || "",
      company_address: client.company_address || "",
      client_type: client.client_type,
    });
  };





  const handleSaveClick = async () => {
    console.log("editeddata is here", editedData);
    if (!editedData.name.trim() || !editedData.contact_detail.trim()) return;

    await editClient(editingClient, editedData);

    setEditingClient(null);
    setEditedData({});
  };

  const handleDeleteClick = async (clientId) => {
    if (deleteConfirm === clientId) {
      await deleteClient(clientId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(clientId);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-md max-h-screen overflow-y-auto">
      <SectionHeader icon={BarChart} title="Clients Management" subtitle="View, edit and manage Clients" />
      {/* <div className="flex justify-between items-center p-4 mb-2">
          <div className="">
            <h2 className="text-xl font-semibold text-gray-800">Clients Management</h2>
            <p className="text-sm text-gray-500 mt-1">View, edit and manage Clients</p>
          </div>
        </div> */}

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white p-4 z-10 shadow-md">
        <Clients />

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 border p-2 rounded-lg shadow-md bg-white">
          <div className="flex items-center gap-3 px-3">
            <label className="text-sm font-medium text-gray-700 text-nowrap">Filter by:</label>
            <button
              onClick={() => setSelectedClientType("Hired on Upwork")}
              className={`px-4 py-2 rounded-md ${selectedClientType === "Hired on Upwork" ? "w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold text-md hover:shadow-lg hover:scale-105 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5" : "bg-gray-200 text-gray-700"}`}
            >
              Upwork
            </button>
            <button
              onClick={() => setSelectedClientType("Direct")}
              className={`px-4 py-2 rounded-md ${selectedClientType === "Direct" ? "w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold text-md hover:shadow-lg hover:scale-105 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5" : "bg-gray-200 text-gray-700"}`}
            >
              Direct
            </button>
          </div>
          {/* <input
              type="text"
              placeholder={`Search by ${filterBy}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}

          <div className="flex items-center w-full border border-gray-300 px-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="h-5 w-5 text-gray-400 mr-[5px]" />
            <input
              type="text"
              className="w-full rounded-lg focus:outline-none py-2"
              placeholder={`Search by ${filterBy}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white cursor-pointer focus:outline-none"
          >
            <option value="name">Client Name</option>
            <option value="hire_on_id">Hiring Id</option>
            <option value="hire_through">Hiring Platform</option>
          </select>


          {/* <button
              onClick={() => clearFilter()}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Clear
            </button> */}
          <ClearButton onClick={() => clearFilter()} />
          <div className="flex gap-3">
            {/* <button
                onClick={() => setShowImportOptions(!showImportOptions)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Import
              </button> */}
            {/* <button
                onClick={() => exportToExcel(clients.data || [], "clients.xlsx")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Export to Excel
              </button> */}

            <ImportButton onClick={() => setShowImportOptions(!showImportOptions)} />
            <ExportButton onClick={() => exportToExcel(clients.data || [], "clients.xlsx")} />

          </div>
        </div>

      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            <thead className="border-b border-gray-800 bg-black text-white">
              <tr className="table-th-tr-row table-bg-heading">
                <th className="px-4 py-2 font-medium text-sm text-center">Client Name</th>
                {filteredEmployees?.some(client => client.client_type === "Hired on Upwork") && (
                  <th className="px-4 py-2 font-medium text-sm">Hiring Id</th>
                )}
                <th className="px-4 py-2 font-medium text-sm text-center">Contact Details</th>
                {filteredEmployees?.some(client => client.client_type === "Direct") && (
                  <>
                    <th className="px-4 py-2 font-medium text-sm">Company Name</th>
                    <th className="px-4 py-2 font-medium text-sm">Address</th>
                  </>
                )}
                <th className="px-4 py-2 font-medium text-sm text-center">Created At</th>
                <th className="px-4 py-2 font-medium text-sm text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      <span className="text-gray-500">Loading clients...</span>
                    </div>
                  </td>
                </tr>
              ) : clients?.data?.length > 0 ? (
                filteredEmployees.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-gray-800 font-medium text-sm text-center">
                      {editingClient === client.id ? (
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => handleInputChange(e, "name")}
                          className="border p-1 w-full"
                        />
                      ) : (
                        client.name
                      )}
                    </td>

                    {client.client_type === "Hired on Upwork" && (
                      <td className="px-6 py-4 text-gray-600 text-sm text-center">
                        {editingClient === client.id ? (
                          <input
                            type="text"
                            value={editedData.hire_on_id || ""}
                            onChange={(e) => handleInputChange(e, "hire_on_id")}
                            className="border p-1 w-full"
                          />
                        ) : (
                          client.hire_on_id || "N/A"
                        )}
                      </td>
                    )}

                    <td className="px-6 py-4 text-gray-600 text-sm text-center">
                      {editingClient === client.id ? (
                        <input
                          type="text"
                          value={editedData.contact_detail}
                          onChange={(e) => handleInputChange(e, "contact_detail")}
                          className="border p-1 w-full"
                        />
                      ) : (
                        client.contact_detail
                      )}
                    </td>

                    {client.client_type === "Direct" && (
                      <>
                        <td className="px-6 py-4 text-gray-600 text-sm text-center">
                          {editingClient === client.id ? (
                            <input
                              type="text"
                              value={editedData.company_name || ""}
                              onChange={(e) => handleInputChange(e, "company_name")}
                              className="border p-1 w-full"
                            />
                          ) : (
                            client.company_name || "N/A"
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm text-center">
                          {editingClient === client.id ? (
                            <input
                              type="text"
                              value={editedData.company_address || ""}
                              onChange={(e) => handleInputChange(e, "company_address")}
                              className="border p-1 w-full"
                            />
                          ) : (
                            client.company_address || "N/A"
                          )}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-gray-600 text-sm text-center">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {editingClient === client.id ? (
                          <>
                            {/* <button
                              onClick={handleSaveClick}
                              className="flex items-center justify-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
                            ><Save className="h-4 w-4 mr-1" />
                              Save
                            </button> */}
                            <IconSaveButton onClick={handleSaveClick} />
                            {/* <button
                              onClick={() => setEditingClient(null)}
                              className="flex items-center justify-center px-3 py-1.5 border border-gray-500 text-gray-500 hover:bg-gray-50 rounded-md transition"
                            >
                              Cancel
                            </button> */}
                            <IconCancelTaskButton onClick={() => setEditingClient(null)} />
                          </>
                        ) : (
                          <>
                            {/* <button
                              onClick={() => handleEditClick(client)}
                              className="flex items-center justify-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button> */}
                            <IconEditButton onClick={() => handleEditClick(client)} />
                            {/* <button
                              onClick={() => {
                                setEditid(client.id);
                                setDeleteclient(true);
                              }}
                              className="flex items-center justify-center px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 rounded-md transition"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button> */}
                            <IconDeleteButton onClick={() => { setEditid(client.id); setDeleteclient(true); }} />
                          </>
                        )}

                      </div>

                      {/* {editingClient === client.id && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Client Type</label>
              <select
                value={editedData.client_type}
                onChange={(e) => handleInputChange(e, "client_type")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Hired on Upwork">Hired on Upwork</option>
                <option value="Direct">Direct</option>
              </select>
            </div>
          )} */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-3">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                      <p className="mt-1 text-sm text-gray-500">No clients have been added yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showImportOptions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col gap-4 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 text-center">Select Import Type</h3>

            <button
              onClick={() => {
                setImportType("excel");
                setShowImportOptions(false);
              }}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 border rounded-md hover:bg-gray-100 transition"
            >
              <FaFileExcel className="text-green-600 text-xl" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => {
                setImportType("googleSheet");
                setShowImportOptions(false);
              }}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 border rounded-md hover:bg-gray-100 transition"
            >
              <FaGoogle className="text-blue-500 text-xl" />
              <span>Import Google Sheet</span>
            </button>

            {/* <button
              onClick={() => setShowImportOptions(false)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button> */}
            <CancelButton onClick={() => setShowImportOptions(false)} />
          </div>
        </div>
      )}

      {importType === "excel" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="mt-3 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-3">
            <p className="text-gray-700 font-medium">Upload an Excel File:</p>
            <input
              type="file"
              accept=".xlsx, .xls"
              //  onChange={handleImport}
              className="px-3 py-2 border rounded-md cursor-pointer"
            />
            <button
              onClick={() => setImportType("")}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {importType === "googleSheet" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="mt-3 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-3">
            <p className="text-gray-700 font-medium">Paste Google Sheet Link:</p>
            <input
              type="text"
              placeholder="Enter Google Sheet link"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              className="px-3 py-2 border rounded-md w-72 focus:outline-none"
            />
            <button
              //  onClick={handleGoogleSheetImport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Import from Google Sheets
            </button>
            <button
              onClick={() => setImportType("")}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {deleteclient && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure you want to delete this folder?
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeleteclient(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>              <button
                onClick={() => {
                  deleteClient(editid);
                  setDeleteclient(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
