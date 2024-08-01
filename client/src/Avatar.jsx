export default function Avatar({ userid, username, online }) {
  const colors = [
    "bg-green-400",
    "bg-red-400",
    "bg-yellow-400",
    "bg-teal-400",
    "bg-blue-400",
    "bg-purple-400",
  ];

  const colorIndex = parseInt(userid, 16) % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className={
        "relative flex h-10 w-10 items-center justify-center rounded-full " +
        color
      }
    >
      <div className="text-lg font-bold text-white">
        {username[0].toUpperCase()}
      </div>
      <div
        className={
          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white" +
          (online ? " bg-green-400" : " bg-gray-400")
        }
      ></div>
    </div>
  );
}
