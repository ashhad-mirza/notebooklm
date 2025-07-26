import { useState } from "react";

export const useChat = (namespace) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    if (!message.trim() || !namespace) return;

    setIsLoading(true);
    try {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          sender: "user",
          timestamp: new Date(),
        },
      ]);

      // Get AI response
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: message,
          namespace,
        }),
      });

      const data = await response.json();

      // Add AI message
      setMessages((prev) => [
        ...prev,
        {
          text: data.answer,
          sender: "bot",
          citations: data.sources,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't process your request.",
          sender: "bot",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};
