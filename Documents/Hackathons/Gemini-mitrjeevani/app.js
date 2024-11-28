import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the backend API of Mitrjeevani");
});
const genAI = new GoogleGenerativeAI(process.env.API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generate = async (prompt) => {
    try {
      if (!prompt || typeof prompt !== "string") {
        throw new Error("Prompt must be a non-empty string");
      }
      const result = await model.generateContent(prompt);
      return result.response.text(); 
    } catch (error) {
      console.error("Error during content generation:", error);
      throw error; // Re-thow
    }
  };
  

// endpoint model 
app.post("/model", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: "Prompt is required" });
  }

  try {
    const result = await generate(prompt);
    res.status(200).send({ output: result });
  } catch (error) {
    res.status(500).send({ error: "Error generating content", details: error.message });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;