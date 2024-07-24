import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get("/profile").then((res) => {
      setId(res.data.userId);
      setLoggedInUsername(res.data.username);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ loggedInUsername, setLoggedInUsername, id, setId }}
    >
      {children}
    </UserContext.Provider>
  );
}
