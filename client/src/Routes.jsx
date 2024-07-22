import { useContext } from "react";
import Register from "./register";
import { UserContext } from "./UserContext.jsx";

export default function Routes() {
  const { username, id } = useContext(UserContext);

  if (username) return `Welcome ${username}`;
  console.log(username);

  return <Register />;
}
