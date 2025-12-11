// server/index.js (Full Merged Server Logic)

import { WebSocketServer } from "ws";
import http from "http"; // Not used, but kept for completeness
import https from "https";
import fs from "fs";
import url from "url";
import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
// Assuming firebaseadmin.js exports the initialized Firestore instance 'db'
import { db } from "./firebaseadmin.js"; 
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { randomBytes } from "crypto";

// ----------------------------------------------------------------------
// 🚨 GEMINI REAL-TIME CORE IMPORTS (Required for AI functionality)
// ----------------------------------------------------------------------
import { GoogleGenAI } from "@google/genai";
// Initialize Gemini (Requires GEMINI_API_KEY in .env)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// ----------------------------------------------------------------------


// Load environment variables
dotenv.config();

// --- Server Configuration ---
var privateKey  = fs.readFileSync('./private.key', 'utf8');
var certificate = fs.readFileSync('./certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const WS_PORT = process.env.PORT || 8080;
const HTTP_PORT = process.env.HTTPPORT || 8081;

// --- Global State ---
const sessions = {}; // Stores active instructor-event WS clients (used by wss)

// --- GEMINI HYBRID MODEL CONSTANTS and STATE ---
const PRO_GEMINI_MODEL = "gemini-2.5-pro"; // Powerful model for instruction adherence
const FLASH_GEMINI_MODEL = "gemini-2.5-flash"; // Cost-effective model

// Map to hold which model is currently active for a given ephemeralKey (Crucial for Hybrid)
const ACTIVE_MODELS = {}; 
const AI_SESSIONS = {}; // Map to store active Gemini WS connections and conversation history
// -----------------------------------------------


// ======================================================================
// 1. EXPRESS HTTP/HTTPS SERVER & REST ENDPOINTS (Merged from createID.js)
// ======================================================================
const app = express();

// Enable CORS and Body Parsing
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Gemini-API-Key"]
}));
app.use(bodyParser.json());

// -----------------------
// TEST
// -----------------------
app.get("/test", (req, res) => res.send("working"));


// -----------------------
// CREATE EMS SESSION 
// -----------------------
app.post("/create", async (req, res) => {
  try {
    const id = randomBytes(6).toString("hex");
    console.log("Creating session:", id);

    const sessionRef = db.collection("sessions").doc(id);
    const userRef = db.collection("users").doc(req.body.UserUID);

    const batch = db.batch();

    batch.set(sessionRef, {
      // Points to the instructor/event WS
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

      HR: 60, BPS: 120, BPD: 80, RR: 18, SPO2: 100, BGL: 90, CAP: 40, EKG: "normal",
      
      // Default AI Model
      AI_MODEL: FLASH_GEMINI_MODEL, 

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


// ------------------------------------------------
// GENERATE EPHEMERAL GEMINI KEY/SESSION (Authentication)
// ------------------------------------------------
app.post("/realtime/token", async (req, res) => {
  try {
    // Generates a temporary key for the client to use for the AI WS connection
    const ephemeralKey = randomBytes(16).toString("hex");
    
    // Initialize the active model mapping for this key (Hybrid Logic)
    ACTIVE_MODELS[ephemeralKey] = FLASH_GEMINI_MODEL;
    
    res.json({
      ephemeralKey: ephemeralKey,
      sessionId: req.body.sessionId || null,
      expiresAt: Date.now() + (3600 * 1000), // 1 hour validity
    });

  } catch (err) {
    console.error("Token error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ----------------------------------------------------
// HYBRID MODEL SWITCHER
// ----------------------------------------------------
app.post("/realtime/switch_model", async (req, res) => {
    try {
        const { ephemeralKey, newModel } = req.body;

        if (!ephemeralKey || !newModel) {
            return res.status(400).json({ error: "Missing key or model name." });
        }
        
        // Update the global state mapping
        ACTIVE_MODELS[ephemeralKey] = newModel;
        
        console.log(`Model for key ${ephemeralKey} switched to: ${newModel}`);

        res.json({ success: true, message: `Model successfully switched to ${newModel}.` });

    } catch (err) {
        console.error("Model switch error:", err);
        res.status(500).json({ error: "Model switch failed" });
    }
});


// Creates HTTPS server
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(HTTP_PORT, () => {
  console.log(`HTTP/S server running on ${process.env.SERVERIP}:${HTTP_PORT}`);
});


// ======================================================================
// 2. INSTRUCTOR EVENT WEBSOCKET SERVER (Your original wss logic)
// ======================================================================
const wss = new WebSocketServer({ 
    server: httpsServer,
    path: '/' // Default path for existing connections
});

console.log(`Instructor Event WS server running on ${process.env.WSURL}:${WS_PORT}`);

// Session clean-up utility
async function delSessionDoc(sessionID) {
  try {
    const sessionRef = db.collection("sessions").doc(sessionID);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      console.log("Session does not exist");
      return;
    }

    const sessionData = sessionSnap.data();
    const userID = sessionData.Owner;

    const userRef = db.collection("users").doc(userID);
    const userSnap = await userRef.get();

    const batch = db.batch();

    if (userSnap.exists) {
      batch.update(userRef, {
        Sessions: admin.firestore.FieldValue.arrayRemove({
          NAME: sessionData.Name || sessionData.NAME,
          ID: sessionID
        })
      });
    }

    batch.delete(sessionRef);

    await batch.commit();
    console.log("Session deleted cleanly");

  } catch (err) {
    console.error("ERROR deleting session:", err);
  }
}


// on client connection (Instructor/Trainee Events)
wss.on("connection", (ws, req) => {
    const { sessionId } = url.parse(req.url, true).query;

    if (!sessionId) {
        ws.send("Missing sessionId");
        return ws.close();
    }

    if(!sessions[sessionId]) sessions[sessionId] = [];
    
    if(!sessions[sessionId].includes(ws)){
        sessions[sessionId].push(ws);
    }
    console.log("EVENTS WS client connected:", sessionId);

    ws.on("message", (msg) => {
        console.log("EVENTS WS received:", msg.toString());
        var jsonMSG = JSON.parse(msg);

        if(jsonMSG.type === "session.end"){
            for(var i = 0; i < sessions[sessionId].length; i++){
                    const client = sessions[sessionId][i];
                    client.send("Session ended by admin");
                    client.close();
                    delete sessions[sessionId];
                    delSessionDoc(sessionId);
                    console.log("Session ended:", sessionId);
                    return;
            }
        }

        for(var i = 0; i < sessions[sessionId].length; i++){
            const client = sessions[sessionId][i];
            if(client !== ws){
                client.send(msg.toString());
            } else if (client == ws){
                ws.send("message received");
            }
        }
    });

  ws.on("close", () => {
    console.log(`EVENTS WS client disconnected: ${sessionId}`)
    if(sessions[sessionId]){
        sessions[sessionId] = sessions[sessionId].filter(client => client !== ws);
        
        if(sessions[sessionId].length === 0){
            delete sessions[sessionId];
            delSessionDoc(sessionId);
            console.log("Session deleted due to no clients:", sessionId);
        }
    }
  });
});


// ======================================================================
// 3. GEMINI REAL-TIME WEBSOCKET SERVER (AI Handler Logic)
// ======================================================================

const wssGemini = new WebSocketServer({ 
    server: httpsServer,
    path: '/realtime/gemini' // Dedicated path for the AI connection
});

console.log("Gemini Real-Time WS server initialized on /realtime/gemini");

wssGemini.on("connection", (ws, req) => {
    const { token } = url.parse(req.url, true).query;
    const ephemeralKey = token;

    if (!ephemeralKey || !ACTIVE_MODELS[ephemeralKey]) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid or missing token/session." }));
        return ws.close();
    }

    console.log(`Gemini WS client connected with key: ${ephemeralKey}`);
    
    // Initialize the session state for the AI
    AI_SESSIONS[ephemeralKey] = {
        ws: ws,
        history: [], // Conversation history for the LLM
        systemInstruction: "",
        currentAudioBuffer: Buffer.from([]), // Buffer for incoming audio (STT)
        ttsVoice: "",
        turnInProgress: false // Flag to prevent concurrent LLM calls
    };

    ws.on("message", async (msg) => {
        const session = AI_SESSIONS[ephemeralKey];

        // 1. Handle Binary Audio Data (Int16 PCM from client)
        if (typeof msg !== 'string') {
            // Buffer audio for STT or VAD
            session.currentAudioBuffer = Buffer.concat([session.currentAudioBuffer, msg]);
            return;
        }

        // 2. Handle Control/Text Messages (JSON)
        try {
            const jsonMSG = JSON.parse(msg);
            
            if (jsonMSG.type === "initial_config") {
                session.systemInstruction = jsonMSG.system_instruction;
                session.ttsVoice = jsonMSG.voice;
                session.history.push({ role: "system", parts: [{ text: session.systemInstruction }] });

            } else if (jsonMSG.type === "user_message") {
                // Add user message to history
                session.history.push({ role: "user", parts: [{ text: jsonMSG.content }] });
                
            } else if (jsonMSG.type === "end_of_turn" || jsonMSG.type === "generate_audio_response") {
                // Trigger STT (missing) and LLM processing
                if (!session.turnInProgress) {
                    await processUserTurn(ephemeralKey);
                }
            }

        } catch (err) {
            console.error("Gemini WS Message Error:", err);
        }
    });

    ws.on("close", () => {
        console.log(`Gemini WS client disconnected: ${ephemeralKey}`);
        delete AI_SESSIONS[ephemeralKey];
        delete ACTIVE_MODELS[ephemeralKey]; // Clean up hybrid map
    });
});


/**
 * Orchestrates the LLM call and (placeholder for) TTS streaming.
 */
async function processUserTurn(ephemeralKey) {
    const session = AI_SESSIONS[ephemeralKey];
    if (!session || session.history.length === 0 || session.turnInProgress) return;

    session.turnInProgress = true; // Lock the turn

    try {
        // 1. Determine the Model (Hybrid Logic)
        const modelName = ACTIVE_MODELS[ephemeralKey] || FLASH_GEMINI_MODEL;
        console.log(`Processing turn using model: ${modelName}`);

        // --- MISSING STT LOGIC:
        // Here, you would call your Speech-to-Text service using session.currentAudioBuffer
        // and add the resulting text to session.history. 
        // session.currentAudioBuffer = Buffer.from([]); // Clear the buffer
        // ---

        // 2. Call Gemini
        const response = await ai.chats.create({
            model: modelName,
            history: session.history,
            config: {
                systemInstruction: session.systemInstruction,
            },
        });
        
        const aiText = response.text;
        
        // Add AI response to history
        session.history.push({ role: "model", parts: [{ text: aiText }] });
        
        // 3. Stream Text to Client
        session.ws.send(JSON.stringify({ type: "ai_text_response", text: aiText, role: "assistant" }));

        // 4. Synthesize and Stream Audio (Placeholder)
        // **This part needs a dedicated TTS service (like Google Cloud TTS) implementation.**
        // The audio output must be encoded (e.g., base64 MP3/OGG) and streamed back.
        
        console.log(`[TTS Placeholder] Synthesizing audio for: "${aiText.substring(0, 50)}..."`);
        
        // Example for placeholder streaming:
        // session.ws.send(JSON.stringify({ type: "ai_audio_chunk", audio: "base64_audio_chunk_1" }));
        // session.ws.send(JSON.stringify({ type: "ai_audio_chunk", audio: "base64_audio_chunk_2" }));
        
    } catch (err) {
        console.error("Gemini LLM Call Error:", err);
        session.ws.send(JSON.stringify({ type: "error", message: "AI processing failed." }));
    } finally {
        session.turnInProgress = false; // Unlock the turn
    }
}