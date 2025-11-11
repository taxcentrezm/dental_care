import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // store your key in .env as OPENAI_API_KEY

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.text?.trim() || "No response from AI.";
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "AI service error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
