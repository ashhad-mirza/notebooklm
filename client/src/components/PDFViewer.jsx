import { useState } from "react";

export default function PDFViewer({ file, pageNumber, onPageChange }) {
  const [numPages, setNumPages] = useState(10); // Simulated PDF with 10 pages

  return (
    <div className="pdf-content">
      <div className="pdf-placeholder">
        <div className="pdf-header">
          <h3>{file.name}</h3>
          <p>
            Document preview - Page {pageNumber} of {numPages}
          </p>
        </div>
        <div className="pdf-pages">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`pdf-page ${
                pageNumber + i === pageNumber ? "active" : ""
              }`}
            >
              <div className="page-content">
                <h4>Page {pageNumber + i}</h4>
                <p>
                  This is a simulated preview of page {pageNumber + i}. In a
                  real implementation, this would show the actual PDF content.
                </p>
                {pageNumber + i === pageNumber && (
                  <div className="citation-highlight">
                    <p>
                      This section contains relevant information related to your
                      query.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
