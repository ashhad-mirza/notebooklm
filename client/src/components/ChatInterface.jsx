import { useState, useRef, useEffect } from "react";

export default function ChatInterface({ messages, onSend, isLoading }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            {msg.citations && (
              <div className="citations">
                <p>References:</p>
                {msg.citations.map((cite, j) => (
                  <button
                    key={j}
                    className="citation"
                    onClick={() => cite.onClick(cite.page)}
                  >
                    Page {cite.page}: {cite.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the document..."
          disabled={isLoading}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
