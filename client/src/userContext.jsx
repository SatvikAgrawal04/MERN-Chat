import { useState, createContext } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [id, setId] = useState(null);
  return (
    <UserContext.Provider
      value={{ loggedInUsername, setLoggedInUsername, id, setId }}
    >
      {children}
    </UserContext.Provider>
  );
}
