export default function Chat() {
  const icon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-blue-100">Contacts</div>
      <div className="flex w-2/3 flex-col bg-blue-300 p-2">
        <div className="flex-grow">Messages with selected chat</div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow rounded-sm border bg-white p-2"
            placeholder="Type your message"
          />
          <button className="rounded-sm bg-blue-500 p-2 text-white">
            {icon()}
          </button>
        </div>
      </div>
    </div>
  );
}
