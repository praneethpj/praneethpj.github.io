import { FaFolder, FaFilePdf, FaImage } from "react-icons/fa";

export const getIcon = (iconType) => {
  switch (iconType) {
    case "folder":
      return <FaFolder className="text-white text-3xl" />;
    case "pdf":
      return <FaFilePdf className="text-white text-3xl" />;
    case "image":
      return <FaImage className="text-white text-3xl" />;
    default:
      return null;
  }
};
