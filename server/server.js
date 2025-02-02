require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const { JWT } = require("google-auth-library");
const cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");
const { VertexAI } = require("@google-cloud/vertexai");
const { Translate } = require("@google-cloud/translate").v2;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Load service account credentials
const serviceAccount = {
  private_key: process.env.PRIVATE_KEY.split(String.raw`\n`).join("\n"),
  client_email: process.env.CLIENT_EMAIL,
};

// Initialize Google Auth client
const authClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

// Initialize BigQuery client
const bigquery = new BigQuery({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
  projectId: "883391227520", // Using the same project ID from your Discovery Engine
});

// Initialize Vertex AI with the correct configuration
const vertex = new VertexAI({
  project: "traveller-351405",
  location: "us-central1",
});
const model = vertex.preview.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generation_config: {
    temperature: 1,
    topP: 0.95,
    max_output_tokens: 8192,
  },
});

// Initialize Text-to-Speech client
const ttsClient = new TextToSpeechClient({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});

// Initialize Translation client
const translate = new Translate({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
  projectId: "883391227520",
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "working properly" });
});

// Proxy endpoint
app.post("/recommend", async (req, res) => {
  try {
    // Get the access token
    const tokenResponse = await authClient.getAccessToken();
    const accessToken = tokenResponse?.token ?? tokenResponse; // Ensure token is a string

    if (!accessToken) {
      console.error("Failed to retrieve access token.");
      return res.status(500).json({ error: "Failed to retrieve access token" });
    }

    // Discovery Engine API Endpoint
    const API_URL =
      "https://discoveryengine.googleapis.com/v1beta/projects/883391227520/locations/global/collections/default_collection/engines/mlb-homerun-engine_1738330462681/servingConfigs/mlb-homerun-engine_1738330462681:recommend";

    // Custom HTTPS Agent to handle SSL issues
    const agent = new https.Agent({
      rejectUnauthorized: false, // Use this for debugging only, remove in production!
    });

    // Forward the request to Discovery Engine API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      agent, // Pass custom agent
    });

    // Handle response
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Error in /recommend:", error);
    res.status(500).json({ error: error.message });
  }
});

// Random row endpoint
app.get("/start-id", async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM mlb_home_runs.home_runs
      ORDER BY RAND()
      LIMIT 1
    `;

    const [rows] = await bigquery.query(query);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No records found" });
    }

    res.json({ id: rows[0]?.id });
  } catch (error) {
    console.error("Error in /random-homerun:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/translate", async (req, res) => {
  try {
    const { language, url } = req.body;

    if (!language || !url) {
      return res.status(400).json({ error: "Language and URL are required" });
    }

    // 1. Get transcription using Vertex AI
    const prompt = `
##Task Description
Listen to this MLB home run highlight video and transcribe the exact commentary spoken by the announcer(s). 

Capture:
- The complete play-by-play call
- All announcer reactions and comments
- Any statistical mentions
- Any historical references
- Multiple announcer voices (if present)
- Crowd reactions mentioned by announcers

##Output Format
Provide a natural text transcription of all spoken commentary, exactly as it was delivered in the video.

Example:
"And here's Judge at the plate... THERE IT GOES! WAY BACK! THAT BALL IS CRUSHED! HOME RUN NUMBER 62! AARON JUDGE HAS JUST MADE AMERICAN LEAGUE HISTORY!"

Requirements:
1. Transcribe word-for-word what was actually said
2. Maintain the natural flow and energy of the call
3. Include all commentary, not just the main call
4. Only include what was actually spoken in the video
5. No additional interpretation or generated content`;

    const systemInstruction =
      "You are a video data analyst with expertise in commercial products. Please do not hallucinate. You can just output nothing if there are no positive findings. Do not output findings for products not matching the reference image.";

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { mimeType: "video/mp4", fileUri: url } },
            { text: prompt },
          ],
        },
      ],
      safety_settings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      ],
      tools: [
        {
          functionDeclarations: [
            {
              name: "system_instruction",
              description: systemInstruction,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const transcription = response.candidates[0].content.parts[0].text;

    // 2. Translate the text using Google Cloud Translation API
    const [translation] = await translate.translate(transcription, language);

    // 3. Convert translated text to speech
    const request = {
      input: { text: translation },
      voice: { languageCode: language, ssmlGender: "MALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(request);
    const audioContent = ttsResponse.audioContent;

    // 4. Send the audio file
    res.set("Content-Type", "audio/mp3");
    res.send(Buffer.from(audioContent, "base64"));
  } catch (error) {
    console.error("Error in /translate:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
