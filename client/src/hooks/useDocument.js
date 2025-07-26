import { useState } from "react";

export const useDocument = () => {
  const [document, setDocument] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadDocument = async (file) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setDocument({
        file: data.pdfUrl,
        namespace: data.namespace,
        pages: data.pages,
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { document, uploadDocument, isProcessing };
};
