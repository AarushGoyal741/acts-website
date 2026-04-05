import { createContext, useContext } from "react";

const RevealContext = createContext(false);

export function RevealProvider({ value, children }) {
  return (
    <RevealContext.Provider value={value}>
      {children}
    </RevealContext.Provider>
  );
}

export function useReveal() {
  return useContext(RevealContext);
}