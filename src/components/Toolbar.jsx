import React, { useState } from "react";

const Toolbar = ({ title, onClose, navigationProps }) => {
  const isMaximized = navigationProps?.isMaximized;
  const toggleMaximize = navigationProps?.toggleMaximize;

  return (
    <div className="handle bg-gray-750 px-4 py-2 flex justify-between items-center cursor-move">
      {/* Left Section - Title with Blue Dot */}
      <span className="font-semibold text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        {title || navigationProps?.currentFolder?.label || "Untitled"}
      </span>

      {/* Right Section - Control Buttons */}
      <div className="flex gap-2">
        {/* Back Button */}
        {navigationProps?.goBack &&
          navigationProps.currentFolder?.id !== navigationProps.folder?.id && (
            <button
              onClick={navigationProps.goBack}
              title="Go Back"
              className="w-3 h-3 bg-gray-500 rounded-full hover:bg-gray-600 transition-colors"
            ></button>
          )}

        {/* Maximize / Minimize Button */}
        {toggleMaximize && (
          <button
            onClick={toggleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
            className={`w-3 h-3 rounded-full transition-colors ${
              isMaximized
                ? "bg-green-500 hover:bg-green-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          ></button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          title="Close"
          className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
        ></button>
      </div>
    </div>
  );
};

export default Toolbar;
