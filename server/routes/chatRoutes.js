import express from "express";
import { chatWithPDF } from "../services/chatService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, namespace } = req.body;
    const response = await chatWithPDF(question, namespace);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
