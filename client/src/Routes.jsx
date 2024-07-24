import { useContext } from "react";
// import Register from "./register";
import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import { UserContext } from "./userContext.jsx";

export default function Routes() {
  const { loggedInUsername, id } = useContext(UserContext);
  if (loggedInUsername) {
    return `Welcome ${loggedInUsername}`;
  }

  return <RegisterAndLoginForm />;
}
