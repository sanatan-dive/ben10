export default function Loading() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse delay-200"></div>
      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse delay-400"></div>
    </div>
  );
}
