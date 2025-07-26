import express from "express";
import multer from "multer";
import { processPDF } from "../services/pdfService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    // 1. Save PDF to disk
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const pdfId = uuidv4();
    const pdfPath = path.join(uploadDir, `${pdfId}.pdf`);
    fs.writeFileSync(pdfPath, req.file.buffer);

    // 2. Process PDF (text extraction + Pinecone)
    const result = await processPDF(req.file.buffer);

    // 3. Return PDF URL + metadata
    res.json({
      success: true,
      pdfUrl: `/uploads/${pdfId}.pdf`, // Public URL
      pages: result.pages,
      namespace: pdfId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const result = await processPDF(req.file.buffer);
    res.json({
      success: true,
      pages: result.pages,
      namespace: req.file.originalname,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
