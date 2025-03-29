import { useState, useEffect } from "react";
import WindowComponent from "./WindowComponent";
import config from "../config";

const AppStore = ({ title, onClose, openIframeWindow }) => {
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const GITHUB_API_URL = config.GITHUB_APP_STORE_URL;
  const GITHUB_RAW_URL = config.GITHUB_STORAGE_URL;

  useEffect(() => {
    const fetchAppStoreContents = async () => {
      try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const contents = await response.json();

        // Filter for .html files and map to app items
        const appItems = contents
          .filter((item) => item.name.endsWith(".html"))
          .map((item, index) => ({
            id: `${index}`,
            label: item.name.replace(".html", ""), // Remove .html from display
            type: "html",
            downloadUrl: item.download_url || `${GITHUB_RAW_URL}/${item.path}`,
            path: item.path,
          }));

        setApps(appItems);
      } catch (err) {
        console.error("Error fetching App Store contents:", err);
        setError("Failed to load App Store contents.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppStoreContents();
  }, []);

  const handleItemClick = (app) => {
    if (app.type === "html" && app.downloadUrl) {
      openIframeWindow({
        id: `iframe-${app.id}-${Date.now()}`,
        type: "iframe",
        content: app.downloadUrl,
        title: app.label,
      });
    }
  };

  return (
    <WindowComponent title={title} onClose={onClose}>
      <div className="relative w-full h-full bg-gray-700 overflow-hidden flex">
        {/* Scrollable & Grid Layout */}
        <div className="w-full h-full overflow-auto p-4">
          {isLoading && (
            <div className="text-white text-center">Loading...</div>
          )}
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          {!isLoading && !error && apps.length === 0 && (
            <div className="text-white text-center">No HTML items found in App Store</div>
          )}
          {!isLoading && !error && apps.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-600 p-6 rounded-lg text-white text-center cursor-pointer hover:bg-gray-500"
                  onClick={() => handleItemClick(app)}
                >
                  {app.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WindowComponent>
  );
};

export default AppStore;