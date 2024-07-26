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
    <div className="flex h-screen items-center justify-center bg-blue-500">
      <form
        className="w-80 rounded-lg bg-white p-6 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-blue-600">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </h2>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="mb-4 block w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="Password"
          className="mb-4 block w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="mb-4 block w-full rounded-md bg-blue-500 p-3 text-white transition duration-300 hover:bg-blue-600">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        {isLoginOrRegister === "register" && (
          <div className="mt-2 text-center text-gray-600">
            Already a member?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsLoginOrRegister("login");
              }}
            >
              Login Here
            </button>
          </div>
        )}
        {isLoginOrRegister === "login" && (
          <div className="mt-2 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
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
