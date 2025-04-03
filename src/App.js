import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import FolderWindow from "./components/FolderWindow";
import PdfViewer from "./components/PdfViewer";
import ImageViewer from "./components/ImageViewer";
import SlideViewer from "./components/SlidesViewer";
import AppStore from "./components/AppStore";
import ContextMenu from "./utils/ContextMenu";
import getIcon from "./utils/getIcon";
import background from "./assets/wallpaper.jpg";
import { createPortal } from "react-dom";
import Toolbar from "./components/Toolbar";

function App() {
  const [fileSystem, setFileSystem] = useState([]);
  const [windows, setWindows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, target: null });
  const [selectedItem, setSelectedItem] = useState(null);


  const GITHUB_REPO_URL = "https://raw.githubusercontent.com/praneethpj/portfolio-storage/master";
  const GITHUB_API_URL = "https://api.github.com/repos/praneethpj/portfolio-storage/contents";

  useEffect(() => {
    const fetchRepoContents = async (path = "") => {
      try {
        const response = await fetch(`${GITHUB_API_URL}${path ? `/${path}` : ""}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const contents = await response.json();

        const files = contents
        .filter(item => !item.name.startsWith("_"))
        .map((item, index) => ({
          id: `${path}-${index}`,
          label: item.name,
          type: item.type === "dir" ? "folder" : getFileType(item.name),
          contentPath: item.path,
          downloadUrl: item.download_url || null,
          iconType: item.type === "dir" ? "folder" : getFileType(item.name),
          position: { top: 50 + index * 20, left: 10 + index * 20 },
        }));

        setFileSystem(files);
      } catch (err) {
        console.error("Error fetching repo contents:", err);
        setError("Failed to load repository contents.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepoContents();
  }, []);

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (extension === "pdf") return "pdf";
    if (extension === "pptx") return "pptx";
    return "file";
  };

  const openWindow = async (item) => {
    const maxZIndex = Math.max(...windows.map((w) => w.zIndex || 0), 0);
    if (item.type === "folder") {
      const response = await fetch(`${GITHUB_API_URL}/${item.contentPath}`);
      const folderContents = await response.json();
      const folderData = {
        ...item,
        contents: folderContents.map((subItem, index) => ({
          id: `${item.id}-${index}`,
          label: subItem.name,
          type: subItem.type === "dir" ? "folder" : getFileType(subItem.name),
          contentPath: subItem.path,
          downloadUrl: subItem.download_url || null,
          iconType: subItem.type === "dir" ? "folder" : getFileType(subItem.name),
        })),
      };
      setWindows((prev) => [
        ...prev,
        { id: `${item.id}-${Date.now()}`, type: "folder", folder: folderData, zIndex: maxZIndex + 1 },
      ]);
    } else {
      const formattedPath = encodeURIComponent(item.contentPath);
      setWindows((prev) => [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          type: item.type,
          content: item.downloadUrl || `${GITHUB_REPO_URL}/${formattedPath}`,
          zIndex: maxZIndex + 1,
        },
      ]);
    }
  };

  const openIframeWindow = (windowData) => {
    const maxZIndex = Math.max(...windows.map((w) => w.zIndex || 0), 0);
    setWindows((prev) => [...prev, { ...windowData, zIndex: maxZIndex + 1 }]);
  };

  const openAppStore = () => {
    const maxZIndex = Math.max(...windows.map((w) => w.zIndex || 0), 0);
    setWindows((prev) => [
      ...prev,
      {
        id: `appstore-${Date.now()}`,
        type: "appstore",
        zIndex: maxZIndex + 1,
      },
    ]);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const targetItem = fileSystem.find((item) => {
      const element = document.getElementById(`item-${item.id}`);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
    });

    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      target: targetItem || null,
    });
  };

  const handleContextSelect = (action) => {
    if (action === "open" && contextMenu.target) {
      openWindow(contextMenu.target);
    } else if (action === "appstore") {
      openAppStore();
    } else if (action === "refresh") {
      setIsLoading(true);
      setFileSystem([]);
      fetch(`${GITHUB_API_URL}`)
        .then((res) => res.json())
        .then((data) => {
          const files = data.      
          filter(item => !item.name.startsWith("_"))
          .map((item, index) => ({
            id: `${index}`,
            label: item.name,
            type: item.type === "dir" ? "folder" : getFileType(item.name),
            contentPath: item.path,
            downloadUrl: item.download_url || null,
            iconType: item.type === "dir" ? "folder" : getFileType(item.name),
            position: { top: 50 + index * 20, left: 10 + index * 20 },
          }));
          setFileSystem(files);
          setIsLoading(false);
        });
    }
  };

  const getContextOptions = () => {
    if (contextMenu.target) {
      return [
        { label: "Open", action: "open" },
        { label: "Open App Store", action: "appstore" },
        { label: "Refresh", action: "refresh" },
      ];
    }
    return [
    
      { label: "Open App Store", action: "appstore" },
      { label: "Refresh", action: "refresh" },
    ];
  };
  const handleItemClick = (item) => {
    setSelectedItem(item.id); // Highlight clicked item
    
  };
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
      onContextMenu={handleContextMenu}
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
        Loading...
      </div>
      )}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xl">
          {error}
        </div>
      )}
      {!isLoading && !error && fileSystem.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
          No files found in the repository
        </div>
      )}

{fileSystem.map((item, index) => (
  <Draggable key={item.id}>
    <div
      id={`item-${item.id}`}
      className={`absolute flex flex-col items-center cursor-pointer ${
        selectedItem === item.id ? "bg-blue-500 bg-opacity-50" : ""
      }`}
      style={{
        top: item.position.top + index * 60 + 50, // Adds space between icons
        left:
          index === 0 || index === 1
            ? 20  * 1 // First two icons closer to the left
            : index === fileSystem.length - 1
            ? 30  * 5 // Last icon slightly left
            : 40 * 3, // Others scattered slightly
      }}
      onDoubleClick={() => openWindow(item)}
      onClick={() => handleItemClick(item)}
      onTouchEnd={(e) => {
        if (e.detail === 2) openWindow(item);
      }}
    >
      {getIcon(item.iconType)}
      <span className="text-white text-xs">{item.label}</span>
    </div>
  </Draggable>
))}


      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        onClose={() => setContextMenu({ ...contextMenu, show: false })}
        options={getContextOptions()}
        onSelect={handleContextSelect}
      />

      {windows.map((win) =>
        win.type === "folder" ? (
          <FolderWindow
            key={win.id}
            folder={win.folder}
            onClose={() => closeWindow(win.id)}
            openWindow={openWindow}
          />
        ) : win.type === "pdf" ? (
          createPortal(
            <PdfViewer key={win.id} src={win.content} onClose={() => closeWindow(win.id)} />,
            document.body
          )
        ) : win.type === "image" ? (
          <ImageViewer key={win.id} src={win.content} onClose={() => closeWindow(win.id)} />
        ) : win.type === "pptx" ? (
          <SlideViewer key={win.id} src={win.content} onClose={() => closeWindow(win.id)} />
        ) : win.type === "appstore" ? (
          <AppStore
            key={win.id}
            title="App Store"
            onClose={() => closeWindow(win.id)}
            openIframeWindow={openIframeWindow}
          />
        ) : win.type === "iframe" ? (
          <Draggable key={win.id}>
            <div
              className="absolute bg-gray-800 text-white p-2 rounded shadow-lg w-3/4 h-3/4"
              style={{ zIndex: 1000000 }}  
            >
               
              <Toolbar title={win.name} onClose={()=> closeWindow(win.id)} />
              <iframe
                src={win.content}
                title={win.title}
                className="w-full h-[calc(100%-2rem)] border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </Draggable>
        ) : null
      )}
    </div>
  );
}

export default App;