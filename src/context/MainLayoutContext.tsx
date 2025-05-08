import { createContext, useContext, useState, type ReactNode } from "react";

type MainLayoutContextType = {
  mainTitle: string;
  setMainTitle: React.Dispatch<React.SetStateAction<string>>;
  mainHeaderTabs: MainHeaderTab[];
  setMainHeaderTabs: React.Dispatch<React.SetStateAction<MainHeaderTab[]>>;
};
export type MainHeaderTab = {
  label: string;
  route: string;
};

const MainLayoutContext = createContext<MainLayoutContextType | null>(null);

export const MainLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [mainTitle, setMainTitle] = useState("");
  const [mainHeaderTabs, setMainHeaderTabs] = useState<MainHeaderTab[]>([]);

  return (
    <MainLayoutContext.Provider
      value={{ mainTitle, setMainTitle, mainHeaderTabs, setMainHeaderTabs }}
    >
      {children}
    </MainLayoutContext.Provider>
  );
};

export const useMainLayout = () => useContext(MainLayoutContext)!;
