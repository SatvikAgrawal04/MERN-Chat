import { useContext } from "react";
// import Register from "./register";
import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import { UserContext } from "./userContext.jsx";
import Chat from "./Chat.jsx";

export default function Routes() {
  const { loggedInUsername, id } = useContext(UserContext);

  if (loggedInUsername) {
    return <Chat />;
  }

  return <RegisterAndLoginForm />;
}
