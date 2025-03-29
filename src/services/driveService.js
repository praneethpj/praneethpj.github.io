const API_KEY = "AIzaSyDLMAZ-cBJk_mhDokfc8u3vlUPG9BxdtYg";
const ROOT_FOLDER_ID = "1D-TxRTPpWfjGNToU0pqYyM9GeVA0-FFA";

export const initClient = (setFileSystem) => {
  window.gapi.client
    .init({
      apiKey: API_KEY,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    })
    .then(() => fetchFolder(ROOT_FOLDER_ID).then((files) => setFileSystem(files)))
    .catch((error) => console.error("Error initializing gapi:", error));
};

export const fetchFolder = async (folderId, position = { top: 20, left: 20 }) => {
  try {
    const response = await window.gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
      key: API_KEY,
    });

    const files = response.result.files || [];
    return await Promise.all(
      files.map(async (file, index) => {
        const isFolder = file.mimeType === "application/vnd.google-apps.folder";
        const isPdf = file.mimeType.includes("pdf");
        const isImage = file.mimeType.includes("image");
        return {
          id: file.id,
          label: file.name,
          type: isFolder ? "folder" : isPdf ? "pdf" : isImage ? "image" : "file",
          iconType: isFolder ? "folder" : isPdf ? "pdf" : isImage ? "image" : "file",
          contentPath: isFolder ? file.webViewLink : file.webContentLink || null,
          position: { top: position.top + index * 60, left: position.left },
          contents: isFolder ? await fetchFolder(file.id) : [],
        };
      })
    );
  } catch (error) {
    console.error("Error fetching folder:", error);
    return [];
  }
};
