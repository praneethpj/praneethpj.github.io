import FolderWindow from "./FolderWindow";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
 
import MyPc from "./MyPc";
import JsTerminal from "./JsTerminal ";

const WindowRenderer = ({ windows, closeWindow }) => {
  return windows.map((win) => {
    switch (win.type) {
      case "mypc":
        return <MyPc key={win.id} folder={win.folder} onClose={() => closeWindow(win.id)} />;
      case "folder":
        return <FolderWindow key={win.id} folder={win.folder} onClose={() => closeWindow(win.id)} />;
      case "pdf":
        return <PdfViewer key={win.id} src={win.content} onClose={() => closeWindow(win.id)} />;
      case "image":
        return <ImageViewer key={win.id} src={win.content} onClose={() => closeWindow(win.id)} />;
      case "terminal":
        return <JsTerminal key={win.id} src={win.content} onClose={() => closeWindow(win.id)} />;
      default:
        return null;
    }
  });
};

export default WindowRenderer;
