import { useEffect } from "react";

const JsExecutor = ({ code }) => {
  useEffect(() => {
    const executeScript = async () => {
      try {
        let scriptContent = code;

        // Check if `code` is a file path, then format it correctly
        if (!code.startsWith("http")) {
          scriptContent = `https://raw.githubusercontent.com/praneethpj/portfolio-storage/master/${encodeURIComponent(code)}`;
        }

        // Fetch the script content
        const response = await fetch(scriptContent);
        if (!response.ok) throw new Error(`Failed to load script: ${scriptContent}`);

        const fetchedCode = await response.text();

        // Execute the script dynamically
        new Function(fetchedCode)(); // Executes safely within scope
      } catch (error) {
        console.error("Error executing script:", error);
      }
    };

    executeScript();
  }, [code]);

  return null; // No UI needed
};

export default JsExecutor;
