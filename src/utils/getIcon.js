import { FaFolder, FaFilePdf, FaImage, FaFile, FaFilePowerpoint } from "react-icons/fa";

const getIcon = (iconType) => {
  switch (iconType) {
    case "folder":
      return <FaFolder className="text-white text-3xl" />;
      case "pptx":
        return <FaFilePowerpoint className="text-red-100 text-3xl" />;
    case "pdf":
      return <FaFilePdf className="text-red-300 text-3xl" />;
    case "image":
      return <FaImage className="text-white text-3xl" />;
    default:
      return <FaFile className="text-white text-3xl" />;
  }
};

export default getIcon;
