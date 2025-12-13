import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { randomBytes } from "crypto";
import admin from "firebase-admin";
import { db } from "../firebaseadmin.js";
import Crypto from 'crypto-js';
import OpenAI from "openai"
const router = express.Router();

// Enable CORS
router.use(cors({
 origin: "*",
 methods: ["GET", "POST"],
 allowedHeaders: ["Content-Type", "Authorization", "OpenAI-Beta"]
}));

router.use(bodyParser.json());

// Set the cost-effective model name
const MINI_REALTIME_MODEL = "gpt-4o-mini-realtime-preview";

// -----------------------
// TEST (Unchanged)
// -----------------------
router.get("/test", (req, res) => res.send("working"));


// -----------------------
// CREATE EMS SESSION (Unchanged)
// -----------------------
router.post("/create", async (req, res) => {
try {
    const id = randomBytes(3).toString("hex");
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
      active: false,
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
// GENERATE EPHEMERAL KEY (Locked to Mini)
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
        // CRITICAL FIX: Ensure the session starts with the mini model
        body: JSON.stringify({
        session: {
            type: "realtime",
            model: MINI_REALTIME_MODEL,
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
// PROXY WEBRTC → OPENAI (Using Mini Model)
// -----------------------
router.post("/realtime/webrtc", async (req, res) => {
    try {
    const { offer, ephemeralKey, model, uid} = req.body;
     // Use model from client request, or default to MINI
    const MODEL_NAME = model || MINI_REALTIME_MODEL;
    const docRef = db.collection("users").doc(uid);
    const doc = await docRef.get();
    let KEY = null; 
    let key = doc.data().key;
    if(key){
       var decrypted = Crypto.AES.decrypt(key, uid).toString(Crypto.enc.Utf8);
       KEY = `Bearer ${decrypted}`;
       console.log("BYOK");
    }else{
        KEY = `Bearer ${process.env.OPENAIKEY}`;
    }
    if (!offer || !ephemeralKey)
        return res.status(400).json({ error: "Missing offer or ephemeral key" });

    const response = await fetch(
      // CRITICAL FIX: Pass the model name in the query string
      `https://api.openai.com/v1/realtime/calls?model=${MODEL_NAME}`, 
      {
        method: "POST",
        headers: {
        "Authorization": KEY,
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
router.post("/report", async (req, res) => {
    try{
        const {uid} = req.body;
        const docRef = db.collection("users").doc(uid);
        const doc = await docRef.get();
        let KEY = null;
        if(doc.data().key){
            var decrypted = Crypto.AES.decrypt(doc.data().key, uid).toString(Crypto.enc.Utf8);
            KEY = `Bearer ${decrypted}`;
        } else{
            KEY = `Bearer ${process.env.OPENAIKEY}`;
        } 
            
        const openai = new OpenAI({
            apiKey: KEY,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
            {
                "role": "system", 
                "content": `Based on this call log grade this ${doc.data().level} student give me the good and the bad. 
                This is only a event log recorded by a ai system you will only get vitlas, interventions and instructor commands.
                Output only the feedback. 
                At the end grade it out of 100 keep it short and sweet 
                Disbatched: ${doc.data().start?.toDate().toLocaleTimeString()} to a ${doc.data().Age} y/o 
                CC: ${doc.data().Issue}
                Behavior: ${doc.data().Behavior || "normal"}
                log: ${doc.data().actionlog}
                `.trim()
            },
            ],
            max_tokens: 100,
        });
        console.log(response.choices[0].message.content);

    }catch(e){
        console.log(e);
    }
});

export default router;