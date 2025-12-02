const ProgressBar = ({ percentage = 0, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
