import { motion } from 'framer-motion';

export default function ModuleCard({ 
  title, 
  description, 
  icon, 
  color = "from-gray-500 to-gray-600", 
  onClick,
  disabled = false 
}) {
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={`
        bg-gradient-to-br ${color} 
        p-6 rounded-xl text-white shadow-lg 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'}
        transition-all duration-300 
        min-h-[140px] w-full
        flex flex-col items-center justify-center text-center
      `}
    >
      <div className="text-3xl mb-3 transform transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-1 leading-tight">
        {title}
      </h4>
      <p className="text-sm opacity-90 leading-snug">
        {description}
      </p>
    </motion.button>
  );
}