import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuthorization = (allowedRoles) => {
  const navigate = useNavigate();
  useEffect(() => {
    const roleName = localStorage.getItem("roleName");
    if (!allowedRoles.includes(roleName)) {
      navigate("/unauthorized");
    }
  }, [navigate, allowedRoles]);
};

export default useAuthorization;
