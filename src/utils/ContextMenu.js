import { useEffect } from "react";

const ContextMenu = ({ x, y, show, onClose, options, onSelect }) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (show) onClose();
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="absolute bg-gray-700 text-white rounded shadow-lg p-2 z-50"
      style={{ top: y, left: x }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
          onClick={() => {
            onSelect(option.action);
            onClose();
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;