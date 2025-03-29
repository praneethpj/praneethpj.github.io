import Draggable from "react-draggable";
import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Minus } from "lucide-react";

const WindowComponent = ({ title, onClose, children }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <Draggable handle=".window-handle" disabled={isMaximized} bounds="parent">
      <div
        className={`fixed bg-gray-800 text-white p-2 rounded shadow-lg z-50 transition-all duration-300 ${
          isMaximized
            ? "w-screen h-screen top-0 left-0"
            : "w-[50vw] h-[70vh] top-[15vh] left-[25vw]"
        }`}
      >
        {/* Header */}
        <div className="window-handle cursor-move flex justify-between items-center bg-gray-900 p-2 rounded-t">
          <span>{title}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className={`w-3 h-3 rounded-full transition-colors ${
                isMaximized ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
              }`}
              title={isMaximized ? "Restore" : "Maximize"}
            ></button>
            <button 
              onClick={onClose} 
              title="Close"
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            ></button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative w-full h-[calc(100%-48px)] bg-gray-700 overflow-hidden flex items-center justify-center">
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
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {children}
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>
    </Draggable>
  );
};

export default WindowComponent;
