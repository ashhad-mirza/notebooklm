import { OpenAI } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";

export const chatWithPDF = async (question, namespace) => {
  // 1. Connect to Pinecone
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pinecone.Index("notebooklm");

  // 2. Create vector store connection
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await Pinecone.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace,
  });

  // 3. Initialize LLM
  const llm = new OpenAI({
    temperature: 0.3,
    modelName: "gpt-4-1106-preview",
  });

  // 4. Create QA chain
  const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());

  // 5. Get response
  // In chatService.js
  const response = await chain.call({
    query: "What are 3 key points from the document?",
    verbose: true, // Add this to see LLM reasoning
  });
  console.log("RAW RESPONSE:", response);

  return {
    answer: response.text,
    sources: response.sourceDocuments.map((doc) => ({
      content: doc.pageContent,
      page: doc.metadata.loc?.pageNumber || 1,
    })),
  };
};
