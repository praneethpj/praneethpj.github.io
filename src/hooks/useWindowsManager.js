import { useState } from "react";

export const useWindowsManager = () => {
  const [windows, setWindows] = useState([]);

  const openWindow = (item) => {
    setWindows((prev) => [
      ...prev,
      {
        id: `${item.id}-${Date.now()}`,
        type: item.type,
        content: item.content,
        folder: item.type === "folder" ? item : null,
      },
    ]);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  };

  return { windows, openWindow, closeWindow };
};
