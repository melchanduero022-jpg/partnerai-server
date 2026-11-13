const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json({ limit: "10kb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("PartnerAI Server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions: "You are PartnerAI, a helpful Android assistant. Give clear and safe answers. Do not claim to have performed actions on the device.",
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("PartnerAI error:", error.message);
    res.status(500).json({
      error: "AI request failed"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("PartnerAI server is running");
});
