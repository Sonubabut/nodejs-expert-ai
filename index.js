// Import ES module syntax
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import GenAI from "./genai.js"; // Note the .js extension for ES Modules

// Initialize dotenv to read environment variables
dotenv.config();

// Define the port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

// Server class
class Server {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.genai = new GenAI();
    this.app.use(express.json());
    this.routes();
    this.listen();
  }

  // Define the API routes
  routes() {
    this.app.post("/api/get-response", (req, res) => {
      this.getResponseGenAI(req, res);
    });
  }

  // Handle the response from GenAI
  async getResponseGenAI(req, res) {
    try {
      const question = req.body.question;
      const response = await this.genai.getResponse(question);
      res.json({ response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Start listening on the specified port
  listen() {
    this.app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}

// Instantiate the server
new Server();
