import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchCurrentUser, logoutUser } from "../services/authApi";

export const AuthProvider = function ({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAuthenticated = !!user;

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    const fetchUser = async function () {
      try {
        const result = await fetchCurrentUser();
        setUser(result);
      } catch (error) {
        console.error(error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [clearSession]);

  const login = function (userData) {
    setUser(userData);
  };

  const logout = async function () {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
