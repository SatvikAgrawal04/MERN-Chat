import { useState, createContext } from "react";

export const userContext = createContext({});

export function UserContextProvider({ children }) {
  const { username, setUsername } = useState(null);
  const { id, setId } = useState(null);
  return (
    <userContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </userContext.Provider>
  );
}
