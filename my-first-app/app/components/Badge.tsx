export default function Badge() {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      Active
    </span>
  );
}