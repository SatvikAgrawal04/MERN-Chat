import { useState, useEffect, useContext, useRef } from "react";
import Avatar from "./Avatar";
import Logo from "./logo";
import { UserContext } from "./userContext.jsx";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact.jsx";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { loggedInUsername, id } = useContext(UserContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    connectToWs();
    // return () => ws.close(); // Cleanup on unmount
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected... Trying to reconnect");
        connectToWs();
      }, 1000);
    });
  }

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      // console.log(res.data);
      // console.log(id);
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      // console.log(offlinePeopleArr);
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      // console.log(offlinePeople);
      setOfflinePeople(offlinePeople);
      // console.log("offline: " +  offlinePeople }
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      // console.log("selectedUserId:" + selectedUserId);
      axios.get("/messages/" + selectedUserId).then((res) => {
        // console.log(res.data);
        setMessages(res.data);
      });
    }
    // scrollBottom();
  }, [selectedUserId]);

  function scrollBottom() {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userid, username }) => {
      people[userid] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    // console.log({ event, messageData });
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      // console.log({ messageData });
      setMessages((prev) => [
        ...prev,
        // {
        //   id: messageData.id,
        //   text: messageData.text.trim(),
        //   senderId: messageData.senderId,
        //   recipientId: messageData.recipientId,
        // },
        { ...messageData },
      ]);
    }
    // scrollBottom();
  }

  function sendMessage(event) {
    event.preventDefault();
    if (selectedUserId && newMessage) {
      const message = {
        id: id,
        senderId: id,
        recipientId: selectedUserId,
        text: newMessage.trim(),
      };
      ws.send(JSON.stringify(message));
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          text: newMessage.trim(),
          senderId: id,
          recipientId: selectedUserId,
        },
      ]);
    }
    // scrollBottom();

    // ws.send(
    //   JSON.stringify({
    //     recipient: selectedUserId,
    //     test: newMessage,
    //   }),
    // );
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
  const messageWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 overflow-y-auto bg-blue-50 p-4">
        <Logo />
        {Object.keys(onlineExcludingCurrentUser).map((userid) => (
          <Contact
            key={userid}
            id={userid}
            username={onlineExcludingCurrentUser[userid]}
            onClick={() => setSelectedUserId(userid)}
            selected={userid === selectedUserId}
            online={true}
          />
        ))}
        {offlinePeople &&
          Object.keys(offlinePeople).map((userid) => (
            <Contact
              key={userid}
              id={userid}
              username={offlinePeople[userid].username}
              onClick={() => setSelectedUserId(userid)}
              selected={userid === selectedUserId}
              online={false}
            />
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
          {!!selectedUserId && (
            <div className="custom-scrollbar overflow-y-scroll">
              {messageWithoutDupes.map((message) => (
                <div
                  key={message._id}
                  className={
                    "my-2 flex " +
                    (message.senderId === id ? "justify-end" : "justify-start")
                  }
                >
                  <div
                    className={
                      "max-w-xs rounded-lg px-4 py-2 shadow-md " +
                      (message.senderId === id
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200 text-gray-900")
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {selectedUserId && (
          <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessage}
              onChange={(ev) => setNewMessage(ev.target.value)}
              type="text"
              className="flex-grow rounded-3xl border border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message"
            />
            <button
              type="submit"
              className="rounded-full bg-blue-500 p-3 text-white shadow-md transition duration-300 hover:bg-blue-600"
            >
              {icon()}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
