import { createContext, useContext } from "react";

// Create the context
const TaskSectionContext = createContext<string | undefined>(undefined);

// Custom hook to use the context
export const useTaskSection = () => {
  const context = useContext(TaskSectionContext);
  if (context === undefined) {
    throw new Error("useTaskSection must be used within a TaskSectionProvider");
  }
  return context;
};

// Context provider component
export const TaskSectionProvider = ({
  section,
  children,
}: {
  section: string;
  children: React.ReactNode;
}) => {
  return (
    <TaskSectionContext.Provider value={section}>
      {children}
    </TaskSectionContext.Provider>
  );
};
