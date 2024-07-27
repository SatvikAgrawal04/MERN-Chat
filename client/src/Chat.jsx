import { useState, useEffect, useContext } from "react";
import Avatar from "./Avatar";
import Logo from "./logo";
import { UserContext } from "./userContext.jsx";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { loggedInUsername, id } = useContext(UserContext);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userid, username }) => {
      people[userid] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }

  const icon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    );
  };

  const onlineExcludingCurrentUser = { ...onlinePeople };
  delete onlineExcludingCurrentUser[id];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 overflow-y-auto bg-blue-50 p-4">
        <Logo />
        {Object.keys(onlineExcludingCurrentUser).map((userid) => (
          <div
            key={userid}
            onClick={() => setSelectedUserId(userid)}
            className={
              "relative flex cursor-pointer items-center gap-3 border-b border-gray-300 px-4 py-3 transition-colors duration-300 " +
              (userid === selectedUserId ? "bg-blue-100" : "hover:bg-blue-50")
            }
          >
            {userid === selectedUserId && (
              <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-blue-600" />
            )}
            <Avatar username={onlinePeople[userid]} userid={userid} />
            <span className="font-medium text-gray-900">
              {onlinePeople[userid]}
            </span>
          </div>
        ))}
      </div>
      {/* Chat Window */}
      <div className="flex flex-1 flex-col bg-blue-100 p-4">
        <div className="flex-grow overflow-y-auto rounded-lg bg-white p-4 shadow-md">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="font-bold text-gray-400">
                {" "}
                &larr; Select a chat
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="flex-grow rounded-3xl border border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message"
          />
          <button className="rounded-full bg-blue-500 p-3 text-white shadow-md transition duration-300 hover:bg-blue-600">
            {icon()}
          </button>
        </div>
      </div>
    </div>
  );
}
