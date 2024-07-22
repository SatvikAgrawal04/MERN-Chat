import { useContext } from "react";
import Register from "./register";
import { userContext } from "./userContext";

export default function Routes() {
  const { username, id } = useContext(userContext);

  if (username) return `Welcome ${username}`;
  return <Register />;
}
