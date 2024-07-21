import Register from "./register";
import axios from "axios";
function App() {
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;
  return <Register />;
}

export default App;
