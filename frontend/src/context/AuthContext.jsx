import { createContext, useContext } from "react";
console.log("inside auth context");

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
