import Draggable from "react-draggable";
import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Minus } from "lucide-react";
import WindowComponent from "./WindowComponent";
import config from "../config";

const ImageViewer = ({ title, src, onClose }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setError("Invalid image source");
      return;
    }

    // Ensure proper URL formatting
    const formattedSrc = src.startsWith("http")
      ? src
      : `${config.GITHUB_STORAGE_URL}${encodeURIComponent(
          src
        )}`;

    setImageUrl(formattedSrc);
  }, [src]);

  return (
    <WindowComponent title={title} onClose={onClose}>
      <div className="relative w-full h-full bg-gray-700 overflow-hidden flex">
        {error ? (
          <div className="flex items-center justify-center h-full w-full text-red-500">
            <span>{error}</span>
          </div>
        ) : imageUrl ? (
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
            panning={{ disabled: false }}
          >
            {({ zoomIn, zoomOut }) => (
              <>
                {/* Zoom Controls */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col space-y-2 bg-gray-900 p-2 rounded">
                  <button
                    onClick={() => zoomIn(0.5)}
                    className="text-white hover:text-gray-400 p-1"
                    title="Zoom In"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={() => zoomOut(0.5)}
                    className="text-white hover:text-gray-400 p-1"
                    title="Zoom Out"
                  >
                    <Minus size={18} />
                  </button>
                </div>
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Opened Image"
                    className="max-w-full max-h-full object-contain select-none"
                    draggable={false}
                    onError={() => setError("Failed to load image")}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span>Loading image...</span>
          </div>
        )}
      </div>
    </WindowComponent>
  );
};

export default ImageViewer;
