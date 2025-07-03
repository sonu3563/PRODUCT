import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiConfig";
import { useAlert } from "./AlertContext";
const ClientContext = createContext();
export const ClientProvider = ({ children }) => {
    const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  console.log(token);
  const handleUnauthorized = (response) => {
    if (response.status === 401) {
      localStorage.removeItem("userToken");
      navigate("/");
      return true;
    }
    return false;
  };
  const addClient = async (clienttype, name, hiringId, contactDetail, address, companyname, communication, projectType) => {
    setIsLoading(true);
    setMessage("");
    try {
        const clientData = {
            client_type: clienttype,
            name,
            contact_detail: contactDetail,
            communication: communication,
            project_type: projectType
        };

        if (clienttype === "Hired on Upwork") {
            clientData.hire_on_id = hiringId;
        } else if (clienttype === "Direct") {
            clientData.company_address = address;
            clientData.company_name = companyname;
        }

        const response = await fetch(`${API_URL}/api/clients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(clientData),
        });

        if (handleUnauthorized(response)) return;

        const data = await response.json();

        if (response.ok) {
            showAlert({ variant: "success", title: "Success", message: "Client added successfully!" });
            fetchClients();
            return { success: true }; // Indicate success to the component
        } else {
            // Check if the response is a validation error (HTTP 422)
            if (response.status === 422 && data.errors) {
                // Return the backend errors to the component
                return { success: false, errors: data.errors };
            } else {
                // For other types of errors, show a general alert
                showAlert({ variant: "error", title: "Error", message: data.message || "An error occurred." });
                return { success: false, errors: {} }; // Return empty errors for non-validation errors
            }
        }
    } catch (error) {
        console.error("Error adding client:", error);
        showAlert({ variant: "error", title: "Error", message: "An error occurred. Please try again." });
        return { success: false, errors: {} };
    } finally {
        setIsLoading(false);
    }
};

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        setClients(data);
        console.log("these are clients",clients);
      } else {
        setMessage("Failed to fetch clients.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching clients.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const editClient = async (id, updatedData) => {
    console.log("id", id);
    console.log("updatedData", updatedData);
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        showAlert({ variant: "success", title: "Success", message: "Client updated successfully" });
        fetchClients();
      } else {
        showAlert({ variant: "error", title: "Error", message: data.message });
      }
    } catch (error) {
      showAlert({ variant: "error", title: "Error", message: "An error occurred while updating the client." });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteClient = async (id) => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (handleUnauthorized(response)) return;
      if (response.ok) {
        showAlert({ variant: "success", title: "Success", message: "Client deleted successfully!" });
        setClients((prevClients) =>
          Array.isArray(prevClients) ? prevClients.filter((client) => client.id !== id) : []
        );
        fetchClients();
      } else {
        showAlert({ variant: "error", title: "Error", message:"Failed to delete client." });
      }
    } catch (error) {
      showAlert({ variant: "error", title: "Error", message:"An error occurred while deleting the client." });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <ClientContext.Provider value={{ addClient, fetchClients, editClient, deleteClient, clients, isLoading, message }}>
      {children}
    </ClientContext.Provider>
  );
};
export const useClient = () => useContext(ClientContext);