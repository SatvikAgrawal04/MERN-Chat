import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext.jsx";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedInUsername, setId } = useContext(UserContext);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === "register" ? "/register" : "/login";
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
      setErrorMessage(""); // Clear error message on successful login/register
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
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
        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-600">
            {errorMessage}
          </div>
        )}
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="Username"
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
        {isLoginOrRegister === "register" ? (
          <div className="mt-2 text-center text-gray-600">
            Already a member?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setIsLoginOrRegister("login")}
            >
              Login Here
            </button>
          </div>
        ) : (
          <div className="mt-2 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setIsLoginOrRegister("register")}
            >
              Register Here
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
