import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPdfUrl, setLoading, setError, resetPdfState } from "../redux/pdfSlice";
import WindowComponent from "./WindowComponent";
import config from "../config";

const PdfViewer = ({ src, onClose }) => {
  const dispatch = useDispatch();
  const { pdfUrl, loading, error } = useSelector((state) => state.pdf);

  useEffect(() => {
    if (!src) {
      dispatch(setError("Invalid PDF source"));
      return;
    }

    dispatch(setLoading(true));

    const formattedSrc = src.startsWith("http")
      ? src
      : `${config.GITHUB_STORAGE_URL}${encodeURIComponent(src)}`;

    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(formattedSrc)}&embedded=true`;

    dispatch(setPdfUrl(googleViewerUrl));
  }, [src, dispatch]);

  return (
    <WindowComponent title="PDF Viewer" onClose={onClose}>
      <div className="w-full h-full flex flex-col">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <span>{error}</span>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <span>Loading PDF...</span>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="PDF Viewer"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span>Failed to load PDF.</span>
          </div>
        )}
      </div>
    </WindowComponent>
  );
};

export default PdfViewer;
