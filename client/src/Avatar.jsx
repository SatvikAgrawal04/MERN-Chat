export default function Avatar({ useri, username }) {
  return (
    <div className="flex h-9 w-9 items-center rounded-full bg-red-200">
      <div className="w-full text-center">{username[0]}</div>
    </div>
  );
}
