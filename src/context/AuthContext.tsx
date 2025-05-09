import { createContext, useContext, type ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
