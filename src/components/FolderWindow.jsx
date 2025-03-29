import { useState } from "react";
import Draggable from "react-draggable";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import JsExecutor from "./JsExecutor";
import getIcon from "../utils/getIcon";
import Toolbar from "../components/Toolbar";
import { createPortal } from "react-dom";
import config from "../config";

const FolderWindow = ({ folder, onClose }) => {
  const [currentFolder, setCurrentFolder] = useState(folder);
  const [windows, setWindows] = useState([]);
  const [folderHistory, setFolderHistory] = useState([folder]);
  const [isMaximized, setIsMaximized] = useState(false);

 
  const fetchFolderContents = async (path) => {
    try {
      const response = await fetch(`${config.GITHUB_API_URL}/${path}`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const contents = await response.json();

      return contents.map((subItem, index) => ({
        id: `${path}-${index}`,
        label: subItem.name,
        type: subItem.type === "dir" ? "folder" : getFileType(subItem.name),
        contentPath: subItem.path,
        downloadUrl: subItem.download_url || null,
        iconType: subItem.type === "dir" ? "folder" : getFileType(subItem.name),
      }));
    } catch (err) {
      console.error("Error fetching folder contents:", err);
      return [];
    }
  };

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (extension === "pdf") return "pdf";
    if (extension === "pptx") return "pptx";
    if (extension === "js") return "js";
    return "file";
  };

  const openItem = async (item) => {
    if (item.type === "folder") {
      console.log("Opening Folder:", item);
      const subFolderContents = await fetchFolderContents(item.contentPath);
      const updatedFolder = { ...item, contents: subFolderContents };
      
      console.log("Fetched Folder Contents:", updatedFolder.contents);

      if (updatedFolder.contents && Array.isArray(updatedFolder.contents)) {
        setFolderHistory((prev) => [...prev, updatedFolder]);
        setCurrentFolder(updatedFolder);
      } else {
        console.error("Failed to fetch valid folder contents:", updatedFolder);
      }
    } else {
      let fileType = item.type;
      if (item.contentPath.endsWith(".js")) {
        fileType = "js";
      }
      setWindows((prev) => [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          type: fileType,
          content: item.downloadUrl || item.contentPath, // Use downloadUrl if available
        },
      ]);
    }
  };

  const goBack = () => {
    if (folderHistory.length > 1) {
      const newHistory = [...folderHistory];
      newHistory.pop();
      const previousFolder = newHistory[newHistory.length - 1];
      setFolderHistory(newHistory);
      setCurrentFolder({ ...previousFolder });
    }
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  };

  const toggleMaximize = () => setIsMaximized((prev) => !prev);

  return (
    <>
      <Draggable handle=".folder-handle">
        <div
          className={`absolute bg-gray-800 text-white p-2 rounded shadow-lg transition-all ${
            isMaximized ? "w-full h-full top-0 left-0" : "w-1/2 h-1/2"
          }`}
        >
          <div className="folder-handle cursor-move">
            <Toolbar
              title={currentFolder.label}
              onClose={onClose}
              navigationProps={{
                isMaximized,
                toggleMaximize,
                goBack,
                currentFolder,
                folder,
              }}
            />
          </div>
          <div className="mt-2">
            {folderHistory.length > 1 && (
              <button
                onClick={goBack}
                className="mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                ← Back
              </button>
            )}
            {currentFolder?.contents && currentFolder.contents.length > 0 ? (
              currentFolder.contents.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center cursor-pointer hover:bg-gray-700 p-1"
                  onDoubleClick={() => openItem(item)}
                >
                  {getIcon(item.iconType)}
                  <span className="ml-2">{item.label}</span>
                </div>
              ))
            ) : (
              <span>No items found</span>
            )}
          </div>
        </div>
      </Draggable>

      {windows.map((win) =>
        win.type === "image" ? (
          createPortal(
            <ImageViewer
              key={win.id}
              src={win.content}
              alt={win.content}
              onClose={() => closeWindow(win.id)}
            />,
            document.body
          )
        ) : win.type === "pdf" ? (
          createPortal(
            <PdfViewer
              key={win.id}
              src={win.content}
              onClose={() => closeWindow(win.id)}
            />,
            document.body
          )
        ) : win.type === "js" ? (
          createPortal(
            <JsExecutor key={win.id} code={win.content} />,
            document.body
          )
        ) : null
      )}
    </>
  );
};

export default FolderWindow;