import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
