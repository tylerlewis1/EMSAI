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
// TEST
// -----------------------
router.get("/test", (req, res) => res.send("working"));


// -----------------------
// CREATE EMS SESSION
// -----------------------
router.post("/create", async (req, res) => {
  try {
    const id = randomBytes(6).toString("hex");
    console.log("Creating session:", id);

    const sessionRef = db.collection("sessions").doc(id);
    const userRef = db.collection("users").doc(req.body.UserUID);

    const batch = db.batch();

    batch.set(sessionRef, {
      wsUrl: `${process.env.WSURL}:${process.env.PORT || 8080}?sessionId=${id}`,
      Name: req.body.Name || "",
      Age: req.body.Age || "",
      Issue: req.body.Issue || "",
      Gender: req.body.Gender || "",
      Other: req.body.Other || "",
      Behavior: req.body.Behavior || "",
      Level: req.body.Level || "",
      Voice: req.body.Voice || "",
      Setting: req.body.Setting || "",
      MedicalHx: req.body.MedicalHx || "",
      Medications: req.body.Medications || "",
      Owner: req.body.UserUID || null,

      HR: 60,
      BPS: 120,
      BPD: 80,
      RR: 18,
      SPO2: 100,
      BGL: 90,
      CAP: 40,
      EKG: "normal",

      createdAt: Date.now(),
      active: true,
    });

    batch.update(userRef, {
      Credits: admin.firestore.FieldValue.increment(-1),
      Sessions: admin.firestore.FieldValue.arrayUnion({
        NAME: req.body.Name || "",
        ID: id,
      })
    });

    await batch.commit();

    console.log("Session created:", id);
    res.json({ sessionId: id });

  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});


// -----------------------
// GENERATE EPHEMERAL KEY
// -----------------------
router.post("/realtime/token", async (req, res) => {
  try {
    const resp = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAIKEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "realtime=v1",
        },
        body: JSON.stringify({})
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
    const { offer, ephemeralKey } = req.body;

    if (!offer || !ephemeralKey) {
      console.error("❌ Missing offer or ephemeralKey");
      return res.status(400).json({ error: "Missing offer or ephemeral key" });
    }

    console.log("📡 Using model: gpt-4o-mini-realtime");
    console.log("OFFER LENGTH:", offer.length);

    const response = await fetch(
      "https://api.openai.com/v1/realtime/calls?model=gpt-4o-mini-realtime",
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
      console.error("❌ OpenAI error response:", answer || "EMPTY ERROR");
      return res.status(500).send(answer);
    }

    res.send(answer);

  } catch (err) {
    console.error("🔥 Proxy error:", err);
    res.status(500).json({ error: "Proxy WebRTC failed" });
  }
});


export default router;
