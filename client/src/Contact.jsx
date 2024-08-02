import Avatar from "./Avatar";

export default function Contact({
  id,
  onClick,
  selected,
  username,
  online,
  darkMode,
}) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`relative flex cursor-pointer items-center gap-3 border-b px-4 py-3 transition-colors duration-300 ${
        darkMode
          ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
          : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
      } ${selected ? "bg-blue-100 dark:bg-blue-900" : ""}`}
    >
      {selected && (
        <div
          className={`absolute bottom-0 left-0 top-0 w-1 rounded-r-md ${
            darkMode ? "bg-blue-500" : "bg-blue-600"
          }`}
        />
      )}
      <Avatar online={online} username={username} userid={id} />
      <span
        className={`font-medium ${
          darkMode ? "text-gray-300" : "text-gray-900"
        }`}
      >
        {username}
      </span>
    </div>
  );
}
