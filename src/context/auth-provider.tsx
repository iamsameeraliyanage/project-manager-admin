import { createContext, useContext } from "react";

import type { User } from "../types/user";
import useAuthUser from "../hooks/api/use-auth-user";

// Define the context shape
type AuthContextType = {
  user?: User;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetchAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: user,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuthUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        error: authError,
        isLoading,
        isFetching,
        refetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
