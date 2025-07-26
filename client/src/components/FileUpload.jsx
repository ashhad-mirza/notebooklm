export default function FileUpload({ onUpload, isProcessing }) {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-section">
      <h2>Upload a PDF Document</h2>
      <p>Select a PDF file to start chatting with your document</p>

      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isProcessing}
      />
      <label htmlFor="pdf-upload">
        {isProcessing ? "Processing..." : "Choose PDF File"}
      </label>

      {isProcessing && (
        <p className="processing-indicator">Processing document...</p>
      )}

      <div className="features">
        <h3>Features:</h3>
        <ul>
          <li>Upload and view PDF documents</li>
          <li>Ask questions about document content</li>
          <li>Get answers with page references</li>
          <li>Click references to navigate to relevant pages</li>
        </ul>
      </div>
    </div>
  );
}
