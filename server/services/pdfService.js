import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

export const processPDF = async (fileBuffer) => {
  // 1. Parse PDF text
  const loader = new PDFLoader(fileBuffer);
  const rawDocs = await loader.load();
  console.log("First page text:", rawDocs[0].pageContent.substring(0, 200));

  // 2. Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  // 3. Generate embeddings
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const vectors = await embeddings.embedQuery("test");
  console.log("Embedding length:", vectors.length);

  // 4. Store in Pinecone
  // In pdfService.js
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    environment: "gcp-starter", // Confirm your environment
  });
  console.log(
    "Pinecone index exists:",
    await pinecone.describeIndex("notebooklm")
  );

  const index = pinecone.Index("notebooklm");
  const queryResponse = await index.query({
    vector: await embeddings.embedQuery("test"),
    topK: 3,
  });
  console.log("Pinecone query results:", queryResponse.matches);
  return {
    pages: rawDocs.length,
    chunks: docs.length,
  };
};
