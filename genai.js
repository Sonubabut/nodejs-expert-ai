import axios from "axios";
import dotenv from "dotenv";


dotenv.config();


class GenAI {
  async getResponse(question) {
    if (!question || question.trim() === "") {
      return "Please enter a valid query";
    }

    const data = {
      instance: {
        conversation_id: "sambaverse-conversation-id",
        messages: [
          {
            message_id: 0,
            role: "system",
            content: "legal expert",
          },
          { message_id: 1, role: "user", content: question },
        ],
      },
      params: {
        do_sample: { type: "bool", value: "true" },
        max_tokens_to_generate: { type: "int", value: "1024" },
        process_prompt: { type: "bool", value: "true" },
        repetition_penalty: { type: "float", value: "1.0" },
        return_token_count_only: { type: "bool", value: "false" },
        select_expert: { type: "str", value: "law-chat" },
        stop_sequences: { type: "str", value: "" },
        temperature: { type: "float", value: "0.7" },
        top_k: { type: "int", value: "50" },
        top_p: { type: "float", value: "0.95" },
      },
    };

    const finalData = {
      instance: JSON.stringify(data.instance),
      params: data.params,
    };

    const headers = {
      "Content-Type": "application/json",
      key: process.env.SAMBA_AI_KEY,
      modelName: process.env.MODEL_NAME,
    };

    const url = process.env.SN_ENDPOINT_URL;

    try {
      const response = await axios.post(url, finalData, { headers });

      // Process the response
      const logs = response.data.split("\n");
      for (const log of logs) {
        try {
          const logObject = JSON.parse(log);
          if (logObject.result && logObject.result.status.complete) {
            return logObject.result.responses[0].completion.trim();
          }
        } catch (parseError) {
          console.warn("Error parsing log line:", parseError);
        }
      }

      return "No response with status.Complete equal to true found";
    } catch (error) {
      console.error("Error making API request:", error.message);
      return "An error occurred while processing your request.";
    }
  }
}

// Export the GenAI class using ES module syntax
export default GenAI;
