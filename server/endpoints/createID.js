// ./endpoints/createID.js

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
  allowedHeaders: ["Content-Type", "Authorization", "X-Gemini-API-Key"]
}));

router.use(bodyParser.json());

// --- GEMINI SPECIFIC CONSTANTS ---
const PRO_GEMINI_MODEL = "gemini-2.5-pro"; // Powerful model for instruction adherence
const FLASH_GEMINI_MODEL = "gemini-2.5-flash"; // Cost-effective model
// Map to hold which model is currently active for a given ephemeralKey
// NOTE: In a production environment, this should be stored in Redis or another cache.
const ACTIVE_MODELS = {}; 
// ---------------------------------


// -----------------------
// TEST (Unchanged)
// -----------------------
router.get("/test", (req, res) => res.send("working"));


// -----------------------
// CREATE EMS SESSION (Sets default model to FLASH)
// -----------------------
router.post("/create", async (req, res) => {
  try {
    const id = randomBytes(6).toString("hex");
    console.log("Creating session:", id);

    const sessionRef = db.collection("sessions").doc(id);
    const userRef = db.collection("users").doc(req.body.UserUID);

    const batch = db.batch();

    batch.set(sessionRef, {
      // wsUrl points to the existing instructor event server
      wsUrl: `${process.env.WSURL}:${process.env.PORT || 8080}?sessionId=${id}`, 
      Name: req.body.Name || "",
      Age: req.body.Age || "",
      Issue: req.body.Issue || "",
      Gender: req.body.Gender || "",
      // ... other fields ...
      Owner: req.body.UserUID || null,

      // Vitals
      HR: 60, BPS: 120, BPD: 80, RR: 18, SPO2: 100, BGL: 90, CAP: 40, EKG: "normal",
      
      // Default AI Model for the session
      AI_MODEL: FLASH_GEMINI_MODEL, 

      createdAt: Date.now(),
      active: true,
    });
    
    // ... (rest of batch update for user)
    // ...

    await batch.commit();

    console.log("Session created:", id);
    res.json({ sessionId: id });

  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});


// ------------------------------------------------
// GENERATE EPHEMERAL GEMINI KEY/SESSION
// ------------------------------------------------
router.post("/realtime/token", async (req, res) => {
  try {
    // In a real app, you'd use a serverless function to securely create a temporary token
    // tied to the session ID. For this example, we just generate a random key.
    const ephemeralKey = randomBytes(16).toString("hex");
    
    // Initialize the active model mapping (Crucial for the hybrid approach)
    ACTIVE_MODELS[ephemeralKey] = FLASH_GEMINI_MODEL;
    
    res.json({
      ephemeralKey: ephemeralKey,
      sessionId: req.body.sessionId || null,
      expiresAt: Date.now() + (3600 * 1000), // 1 hour
    });

  } catch (err) {
    console.error("Token error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ----------------------------------------------------
// 🎯 HYBRID MODEL SWITCHER
// Updates the server-side model mapping for the current session.
// ----------------------------------------------------
router.post("/realtime/switch_model", async (req, res) => {
    try {
        const { ephemeralKey, newModel } = req.body;

        if (!ephemeralKey || !newModel) {
            return res.status(400).json({ error: "Missing key or model name." });
        }
        
        // This is where we update the cache/map for the dedicated Gemini WS server 
        // to use the correct model for the next turn.
        ACTIVE_MODELS[ephemeralKey] = newModel;
        
        console.log(`Model for key ${ephemeralKey} switched to: ${newModel}`);

        res.json({ success: true, message: `Model successfully switched to ${newModel}.` });

    } catch (err) {
        console.error("Model switch error:", err);
        res.status(500).json({ error: "Model switch failed" });
    }
});


export default router;