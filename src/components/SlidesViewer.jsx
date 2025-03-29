import { useEffect, useState } from "react";
import WindowComponent from "./WindowComponent";

const SlideViewer = ({ src, onClose }) => {
  const [slideUrl, setSlideUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setError("Invalid Slide source");
      setLoading(false);
      return;
    }

    if (src.endsWith(".pptx")) {
      // Use Microsoft Office Online Viewer
      const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(src)}`;
      setSlideUrl(officeViewerUrl);
      setLoading(false);
    } else {
      // Optional: Google Slides support
      const googleDriveMatch = src.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (googleDriveMatch) {
        const fileId = googleDriveMatch[1];
        const googleSlidesUrl = `https://docs.google.com/presentation/d/${fileId}/embed?start=true&loop=true&delayms=5000`;
        setSlideUrl(googleSlidesUrl);
        setLoading(false);
      } else {
        setError("Unsupported file format or invalid link");
        setLoading(false);
      }
    }
  }, [src]);

  return (
    <WindowComponent title="Slide Viewer" onClose={onClose}>
      <div className="w-full h-full flex flex-col">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <span>{error}</span>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <span>Loading Slides...</span>
          </div>
        ) : slideUrl ? (
          <>
            <iframe
              src={slideUrl}
              className="w-full h-full"
              title="Slide Viewer"
              allowFullScreen
            />
            {src.endsWith(".pptx") && (
              <div className="absolute top-2 left-2 bg-gray-800 text-white p-2 rounded text-sm">
                Click "Start Slideshow" in the top-right corner for presentation mode
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span>Failed to load Slides.</span>
          </div>
        )}
      </div>
    </WindowComponent>
  );
};

export default SlideViewer;