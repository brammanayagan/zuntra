const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Dynamic breathing bounce circles in Pinterest brand red */}
      <div className="flex space-x-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-[#E60023] [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-[#E60023] [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-[#E60023]"></div>
      </div>
      <span className="text-sm font-semibold tracking-wider text-zinc-400">Loading PinStack...</span>
    </div>
  );
};

export default Loader;
