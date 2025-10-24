import { createContext, useContext, useState, type ReactNode } from "react";

type MainLayoutContextType = {
  mainTitle: string;
  setMainTitle: React.Dispatch<React.SetStateAction<string>>;
  mainHeaderTabs: MainHeaderTab[];
  setMainHeaderTabs: React.Dispatch<React.SetStateAction<MainHeaderTab[]>>;
  backLink: string | null;
  setBackLink: React.Dispatch<React.SetStateAction<string | null>>;
};
export type MainHeaderTab = {
  label: string;
  route: string;
};

const MainLayoutContext = createContext<MainLayoutContextType | null>(null);

export const MainLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [mainTitle, setMainTitle] = useState("");
  const [mainHeaderTabs, setMainHeaderTabs] = useState<MainHeaderTab[]>([]);
  const [backLink, setBackLink] = useState<string | null>(null);

  return (
    <MainLayoutContext.Provider
      value={{
        mainTitle,
        setMainTitle,
        mainHeaderTabs,
        setMainHeaderTabs,
        backLink,
        setBackLink,
      }}
    >
      {children}
    </MainLayoutContext.Provider>
  );
};

export const useMainLayout = () => useContext(MainLayoutContext)!;
