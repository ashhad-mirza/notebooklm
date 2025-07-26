import { useState } from "react";
import PDFViewer from "./components/PDFViewer";
import ChatInterface from "./components/ChatInterface";
import FileUpload from "./components/FileUpload";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your document assistant. Upload a PDF and I'll help you understand it.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPdfFile(file);
      setMessages([
        ...messages,
        {
          text: `I've loaded "${file.name}". Ask me anything about this document!`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        {
          text: "Sorry, I couldn't process that file. Please try another PDF.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate citations
    const citations = [];
    for (let i = 0; i < Math.min(3, Math.floor(Math.random() * 3) + 1); i++) {
      const page = Math.floor(Math.random() * 10) + 1;
      citations.push({
        text: `Relevant content from page ${page}...`,
        page: page,
      });
    }

    // Add bot response
    const botMessage = {
      text: `Based on the document, ${message.toLowerCase()} is addressed in several sections. Here's what I found most relevant.`,
      sender: "bot",
      citations: citations,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleCitationClick = (page) => {
    setPageNumber(page);
  };

  // Prepare messages with citation handlers
  const processedMessages = messages.map((msg) => ({
    ...msg,
    citations: msg.citations?.map((cite) => ({
      ...cite,
      onClick: handleCitationClick,
    })),
  }));

  return (
    <div className="app">
      <header className="app-header">
        <h1>NotebookLM Clone</h1>
        <p>Upload a PDF and chat with your document</p>
      </header>

      {!pdfFile ? (
        <FileUpload onUpload={handleFileUpload} isProcessing={isProcessing} />
      ) : (
        <div className="workspace">
          <div className="pdf-viewer">
            <div className="pdf-container">
              <PDFViewer
                file={pdfFile}
                pageNumber={pageNumber}
                onPageChange={setPageNumber}
              />
            </div>
            <div className="page-controls">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
              >
                Previous
              </button>
              <span className="page-info">Page {pageNumber}</span>
              <button onClick={() => setPageNumber((p) => p + 1)}>Next</button>
            </div>
          </div>
          <div className="chat-interface">
            <ChatInterface
              messages={processedMessages}
              onSend={handleSendMessage}
              isLoading={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
