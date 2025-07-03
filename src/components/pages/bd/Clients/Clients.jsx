import React, { useState } from "react";
import { useClient } from "../../../context/ClientContext";
import { Loader2 } from "lucide-react";
import { EditButton, SaveButton, CancelButton, YesButton, DeleteButton, ExportButton, ImportButton, ClearButton, CloseButton, SubmitButton, IconApproveButton, IconRejectButton, IconCancelTaskButton, IconSaveButton, IconDeleteButton, IconEditButton, IconViewButton, } from "../../../AllButtons/AllButtons";


export const Clients = () => {
  const { addClient, isLoading, message } = useClient();
  const [clientName, setClientName] = useState("");
  const [hiringId, sethringId] = useState("");
  const [contactDetail, setContactDetail] = useState("");
  const [clienttype, setClienttype] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [address, setAddress] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [formType, setFormType] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const showAlert = ({ variant, title, message }) => {
    alert(`${title}: ${message}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting:", { clientName, hiringId, contactDetail, address, companyname, clienttype });

    if (clienttype === "Hired on Upwork") {
      if (!clientName.trim() || !hiringId.trim() || !contactDetail.trim()) {
        showAlert({ variant: "error", title: "Error", message: "Please fill all required fields for Upwork client." });
        return;
      }
    } else if (clienttype === "Direct") {
      if (!clientName.trim() || !contactDetail.trim() || !address.trim() || !companyname.trim()) {
        showAlert({ variant: "error", title: "Error", message: "Please fill all required fields for Direct client." });
        return;
      }
    } else {
      showAlert({ variant: "error", title: "Error", message: "Please select a client type." });
      return;
    }

    await addClient(clienttype, clientName, hiringId, contactDetail, address, companyname);

    console.log("Client added successfully!");

    setClientName("");
    sethringId("");
    setAddress("");
    setContactDetail("");
    setCompanyname("");
    setClienttype("");
    setShowMessage(true);
    setFormType(null);
  };



  return (
    <div className="">
      {/* <h2 className="text-xl font-semibold text-gray-800">Enter Client Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add a new Client to the system</p> */}

      <button onClick={() => setShowPopup(true)} className="add-items-btn">
        Add Client
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-center">Select Hiring Method</h3>
            <div className="grid flex-col space-y-4 my-4 justify-center">
              <button onClick={() => { setFormType("upwork"); setClienttype("Hired on Upwork"); setShowPopup(false); }} className="px-4 py-2 bg-blue-500 text-white rounded-md">Hired on Upwork</button>
              <button onClick={() => { setFormType("direct"); setClienttype("Direct"); setShowPopup(false); }} className="px-4 py-2 bg-green-500 text-white rounded-md">Direct</button>
            </div>
            <button onClick={() => setShowPopup(false)} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-medium p-2 rounded-md transition-colors duration-150">Close</button>
          </div>
        </div>
      )}

      {showMessage && message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm font-medium text-center ${message.includes("successfully")
            ? "bg-green-50 text-green-800 border border-green-300"
            : "bg-red-50 text-red-800 border border-red-300"
            }`}
        >
          {message}
        </div>
      )}

      {formType === "upwork" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Upwork Hiring Form</h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="clientName" className="block font-medium text-gray-700 text-sm">
                  Client Name
                </label>
                <input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter Client Name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="contactDetail" className="block font-medium text-gray-700 text-sm">
                  Contact Details
                </label>
                <input
                  id="contactDetail"
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                  placeholder="Enter Contact Details"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="hiringId" className="block font-medium text-gray-700 text-sm">
                  Hiring Id
                </label>
                <input
                  id="hiringId"
                  value={hiringId}
                  onChange={(e) => sethringId(e.target.value)}
                  placeholder="Enter Contact Details"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Client...
                  </>
                ) : (
                  "Submit"
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormType(null)}
                className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-medium p-2 rounded-md transition-colors duration-150"
              >
                Close
              </button> */}
              <SubmitButton disabled={isLoading} />
              <CloseButton onClick={() => setFormType(null)} />
            </form>
          </div>
        </div>
      )}



      {formType === "direct" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Direct Hiring Form</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter Client Name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Details</label>
                <input
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                  placeholder="Enter Contact Details"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  value={companyname}
                  onChange={(e) => setCompanyname(e.target.value)}
                  placeholder="Enter Company Name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md">
                Submit
              </button>

              <button
                type="button"
                onClick={() => setFormType(null)}
                className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-medium p-2 rounded-md transition-colors duration-150"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};