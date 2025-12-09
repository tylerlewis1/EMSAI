import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { randomBytes } from "crypto";
import admin from "firebase-admin";
import { db } from "../firebaseadmin.js";
const router = express.Router();

// Enable CORS
router.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "OpenAI-Beta"]
}));

router.use(bodyParser.json());

// -----------------------
// TEST (Unchanged)
// -----------------------
router.get("/test", (req, res) => res.send("working"));


// -----------------------
// CREATE EMS SESSION (Unchanged)
// -----------------------
router.post("/create", async (req, res) => {
// ... (Your /create logic is unchanged)
});


// -----------------------
// GENERATE EPHEMERAL KEY
// -----------------------
router.post("/realtime/token", async (req, res) => {
  try {
    // Optional: You could pass model in the request body here if you wanted to choose
    // the model dynamically, but for now, we hardcode to the most cost-effective.
    const MODEL_NAME = "gpt-4o-mini-realtime-preview"; 

    const resp = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAIKEY}`,
          "Content-Type": "application/json",
          // NOTE: The "OpenAI-Beta" header is still required for the preview endpoint
          "OpenAI-Beta": "realtime=v1",
        },
        // CRITICAL FIX: Explicitly request the session to use the mini model here.
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: MODEL_NAME,
            // You could also set initial instructions here if you want to save a client message
          }
        })
      }
    );

    const raw = await resp.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Invalid JSON from OpenAI" });
    }

    if (data.error) return res.status(500).json({ error: data.error.message });

    res.json({
      ephemeralKey: data.value,
      sessionId: data.session?.id || null,
      expiresAt: data.expires_at,
    });

  } catch (err) {
    console.error("Token error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// -----------------------
// PROXY WEBRTC → OPENAI
// -----------------------
router.post("/realtime/webrtc", async (req, res) => {
  try {
    const { offer, ephemeralKey, model } = req.body; // <-- Capture model name from client request body
    
    // Use the model provided by the client, or default to the most cost-effective mini model
    const MODEL_NAME = model || "gpt-4o-mini-realtime-preview";

    if (!offer || !ephemeralKey)
      return res.status(400).json({ error: "Missing offer or ephemeral key" });

    const response = await fetch(
      // CRITICAL FIX: Dynamically set the model in the query string
      `https://api.openai.com/v1/realtime/calls?model=${MODEL_NAME}`, 
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAIKEY}`,
          "OpenAI-Session": ephemeralKey,
          "Content-Type": "application/sdp",
          "OpenAI-Beta": "realtime=v1",
        },
        body: offer
      }
    );

    const answer = await response.text();

    if (!response.ok) {
      console.error("OpenAI error:", answer);
      return res.status(500).send(answer);
    }

    res.send(answer);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy WebRTC failed" });
  }
});


export default router;