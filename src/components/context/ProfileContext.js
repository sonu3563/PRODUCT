import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from "../utils/ApiConfig";
const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);
export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("user_id");
    const fetchProfile = async () => {
        const token = localStorage.getItem("userToken");
        const userId = localStorage.getItem("user_id");
        // console.log("hellooo",token);
        //  console.log("hellooo userId",userId);
        
        try {
            if (!token || !userId) return;
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/getmyprofile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setProfile(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
        };
        useEffect(() => {
              fetchProfile();
        
          }, []);
    return (
        <ProfileContext.Provider value={{ profile, loading, error, fetchProfile }}>
        {children}
        </ProfileContext.Provider>
    );
};
