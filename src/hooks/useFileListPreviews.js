import { useEffect, useState } from "react";

export const useFileListPreviews = (fileListLike) => {
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const valid =
      fileListLike &&
      typeof fileListLike.length === "number" &&
      fileListLike.length > 0;

    if (!valid) {
      setPreviewUrls([]);
      return undefined;
    }

    const urls = Array.from(fileListLike).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileListLike]);

  return previewUrls;
};
