import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext.jsx";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedInUsername, setId } = useContext(UserContext);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");

  async function handleSubmit(ev) {
    const url = isLoginOrRegister === "register" ? "/register" : "/login";
    ev.preventDefault();
    const { data } = await axios.post(url, {
      username,
      password,
    });
    setLoggedInUsername(username);
    setId(data.id);
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        {isLoginOrRegister === "register" && (
          <div className="text-center mt-2">
            Already a member?{" "}
            <button
              onClick={() => {
                setIsLoginOrRegister("login");
              }}
            >
              Login Here
            </button>
          </div>
        )}
        {isLoginOrRegister === "login" && (
          <div className="text-center mt-2">
            Don't have an account?
            <button
              onClick={() => {
                setIsLoginOrRegister("register");
              }}
            >
              Register Here
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
