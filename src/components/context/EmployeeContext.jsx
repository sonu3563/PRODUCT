import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/ApiConfig";
import Alert from "../components/Alerts";
import { useAlert } from "./AlertContext";

const EmployeeContext = createContext(undefined);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // This is more for general context-level errors, not specific validation ones
  const { showAlert } = useAlert();

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch employees"); // Throw specific message if available
      }
      const data = await response.json();
      console.log("all employess,", data);
      setEmployees(data.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message); // Set general error for the context
      showAlert({ variant: "error", title: "Error", message: err.message }); // Show an alert for fetch errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (employeeData) => {
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
  
      // Append basic fields
      formData.append("name", employeeData.name || "");
      formData.append("email", employeeData.email || "");
      formData.append("password", employeeData.password || "");
      formData.append("address", employeeData.address || "");
      formData.append("phone_num", employeeData.phone_num || "");
      formData.append("emergency_phone_num", employeeData.emergency_phone_num || "");
      if (employeeData.role_id) {
        formData.append("role_id", employeeData.role_id);
      } else {
        formData.append("roles", employeeData.roles);
      }
      formData.append("pm_id", employeeData.pm_id || "1");
  
      // ✅ Correct team_id logic
      if (["1", "2", "3", "4"].includes(employeeData.role_id)) {
        formData.append("team_id", "");
      } else {
        formData.append("team", employeeData.team_id || employeeData.team);
      }
  
      // ✅ Handle profile_pic (expecting single file)
      const images = employeeData.profile_pics || [];
      if (images.length > 1) {
        showAlert({
          variant: "error",
          title: "Upload Error",
          message: "You can upload a maximum of 1 image.",
        });
        return;
      }
  
      if (images.length === 1 && images[0] instanceof File) {
        formData.append("profile_pic", images[0]);
      }
  
      // Optional: log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  console.log("Adding new employee with data:", formData);
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse));
      }
  
      const newEmployee = await response.json();
      setEmployees((prev) => [...prev, newEmployee.data]);
  
      showAlert({
        variant: "success",
        title: "Success",
        message: "Employee added successfully",
      });
  
      setError(null);
    } catch (err) {
      const data = err?.response?.data || err;
  
      const firstError = data?.errors
        ? Object.values(data.errors)[0][0]
        : data?.message || "Something went wrong";
  
      showAlert({
        variant: "error",
        title: "Failed",
        message: firstError,
      });
  
      setError(err.message);
      throw err;
    }
  };
  
  

  const updateEmployee = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();

      // Append all fields, even if empty, as the backend validation expects them
      formData.append("name", updatedData.name);
      formData.append("email", updatedData.email);
      formData.append("phone_num", updatedData.phone_num || "");
      formData.append("emergency_phone_num", updatedData.emergency_phone_num || "");
      formData.append("address", updatedData.address || "");
      formData.append("team_id", updatedData.team_id || ""); // Ensure empty string for null/undefined
      formData.append("role_id", updatedData.role_id || ""); // Ensure empty string for null/undefined
      formData.append("pm_id", updatedData.pm_id || ""); // Ensure empty string for null/undefined

      // This is crucial for Laravel to interpret the request as a PUT/PATCH with FormData
      formData.append('_method', 'PUT');

      if (updatedData.profile_pic instanceof File) {
        formData.append("profile_pic", updatedData.profile_pic);
      } else if (updatedData.profile_pic === null) {
        // If profile_pic is explicitly set to null (e.g., user cleared it), send a specific signal
        formData.append("profile_pic", ""); // Or 'null', depends on backend's handling of empty file upload
      }
      // If profile_pic is a URL string and not changed, don't append it to formData
      // The backend should retain the existing one if no new file is provided.
console.log("Updating employee with ID:", updatedData.profile_pic);
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: "POST", // Method remains POST because of _method=PUT workaround for FormData
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type" is automatically set to multipart/form-data when using FormData, DO NOT SET IT MANUALLY
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        // --- IMPORTANT CHANGE HERE ---
        // Throw the entire errorResponse object, stringified, so the component can parse it
        throw new Error(JSON.stringify(errorResponse));
      }

      fetchEmployees(); // Re-fetch all employees to ensure UI is up-to-date
      showAlert({ variant: "success", title: "Success", message: "Employee updated successfully" });
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.message); // Set the error state in context
      // Re-throw the error so the component's catch block can handle it
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete employee");
      }
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      showAlert({ variant: "success", title: "Success", message: "Deleted Successfully" });
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError(err.message);
      showAlert({ variant: "error", title: "Error", message: err.message });
    }
  };

  return (
    <EmployeeContext.Provider value={{ employees, loading, error, fetchEmployees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};