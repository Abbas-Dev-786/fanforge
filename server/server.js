require("dotenv").config();
const express = require("express");
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

// Proxy endpoint
app.post("/recommend", async (req, res) => {
  try {
    // Get the access token
    const token = await authClient.getAccessToken();

    console.log(token);

    // Forward the request to Discovery Engine API
    const response = await fetch(
      "https://discoveryengine.googleapis.com/v1beta/projects/883391227520/locations/global/collections/default_collection/engines/mlb-homerun-engine_1738330462681/servingConfigs/mlb-homerun-engine_1738330462681:recommend",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
