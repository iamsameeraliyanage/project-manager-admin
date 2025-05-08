import { createContext, useContext, useState, type ReactNode } from "react";

type MainLayoutContextType = {
  mainTitle: string;
  setMainTitle: React.Dispatch<React.SetStateAction<string>>;
};

const MainLayoutContext = createContext<MainLayoutContextType | null>(null);

export const MainLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [mainTitle, setMainTitle] = useState("");

  return (
    <MainLayoutContext.Provider value={{ mainTitle, setMainTitle }}>
      {children}
    </MainLayoutContext.Provider>
  );
};

export const useMainLayout = () => useContext(MainLayoutContext)!;
