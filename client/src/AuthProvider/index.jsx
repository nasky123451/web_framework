import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = useCallback(() => {
    setAuth({});
    fetch( "/logout", {
      method: "GET",
      headers: new Headers({
          "Content-type": "application/x-www-form-urlencoded"
      })
    })
    .then(res => res.json())
    .then(data => {
      navigate("/");
    })
    .catch(e => {
        /*發生錯誤時要做的事情*/
        console.log(e);
    })
    
  }, []);

  const fetchUserData = useCallback(() => {
    fetch("/getMe", {
      method: "GET",
      headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded"
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        return res.json();
      })
      .then(data => {
        const { name, username, permission } = data;
        setAuth({ username, name, permission });
      })
      .catch(handleError);
  }, [handleError]);

  useEffect(() => {
    if (!auth.name && location.pathname !== "/") {
      fetchUserData();
    }
  }, [auth.name, location.pathname, fetchUserData]);

  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (location.pathname !== "/") {
        fetchUserData();
      }
    }, 15 * 60 * 1000);
  }, [location.pathname, fetchUserData]);

  useEffect(() => {
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    return () => {
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keypress", resetTimer);
    };
  }, [resetTimer]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;