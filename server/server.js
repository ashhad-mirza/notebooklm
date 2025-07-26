require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { processPDF } = require("./services/pdfService");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

// Simulated PDF processing endpoint
// In server.js
app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  try {
    console.log(req.file); // Check file is received
    const result = await processPDF(req.file.buffer);
    res.json(result);
  } catch (error) {
    console.error("PDF Processing Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Simulated chat endpoint
app.post("/api/chat", (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    // Simulate AI processing delay
    setTimeout(() => {
      // Generate simulated citations
      const citations = [];
      const citationCount = Math.min(3, Math.floor(Math.random() * 3) + 1);

      for (let i = 0; i < citationCount; i++) {
        const page = Math.floor(Math.random() * 10) + 1;
        citations.push({
          text: `Relevant content from page ${page}...`,
          page: page,
        });
      }

      res.json({
        answer: `Based on the document, ${question.toLowerCase()} is addressed in several sections. Here's what I found most relevant.`,
        citations: citations,
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ error: "Error processing question" });
  }
});

// Serve client in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
