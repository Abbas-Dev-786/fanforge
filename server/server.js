require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const { JWT } = require("google-auth-library");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Load service account credentials
const serviceAccount = {
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
};

// Initialize Google Auth client
const authClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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

    console.log("Access Token:", accessToken);

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
