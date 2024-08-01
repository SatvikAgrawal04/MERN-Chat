import Avatar from "./Avatar";

export default function Contact({ id, onClick, selected, username, online }) {
  return (
    <div
      onClick={() => onClick(id)}
      className={
        "relative flex cursor-pointer items-center gap-3 border-b border-gray-300 px-4 py-3 transition-colors duration-300 " +
        (selected ? "bg-blue-100" : "hover:bg-blue-50")
      }
    >
      {selected && (
        <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-blue-600" />
      )}
      {/* {console.log(username)} */}
      <Avatar online={online} username={username} userid={id} />
      <span className="font-medium text-gray-900">{username}</span>
    </div>
  );
}
