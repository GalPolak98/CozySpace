import { useLanguage } from "@/context/LanguageContext";
import GenericHeader from "../navigation/GenericHeader";
import React, { useState, useEffect } from "react";
import useAuth from '@/hooks/useAuth';
import { userService } from '@/services/userService';

const ReportsHeader = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const { t } = useLanguage();
  const userId = useAuth();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await userService.getUserById(userId as string);
          if (userData?.userType) {
            setUserType(userData.userType);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      if (userId) {
        fetchUserData();
      }
    }, [userId]);
    
    let backPath: "/(patient)/home" | "/(therapist)/home" | "/(patient)/information" = "/(patient)/home"; //Default backPath
    if (userType === "therapist") {
      backPath = "/(therapist)/home"; 
    } else if (userType === "patient") {
      backPath = "/(patient)/home"; 
    }

  return (
    <GenericHeader
      title={t.tabsPatient.reports}
      toggleTheme={toggleTheme}
      backPath={backPath} // Dynamically set the backPath
    />
  );
};

export default ReportsHeader;
