// server/index.js
import { WebSocketServer } from "ws";
import http from "http";
import https from "https";
import fs from "fs";
import url from "url";
import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { db } from "./firebaseadmin.js";
import createIDRouter from "./endpoints/createID.js";
var privateKey  = fs.readFileSync('./private.key', 'utf8');
var certificate = fs.readFileSync('./certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
import cors from "cors";
const sessions = {};
//load environment variables
dotenv.config();
// Ports
const WS_PORT = process.env.PORT || 8080;
const HTTP_PORT = process.env.HTTPPORT || 8081;
//http server for REST endpoints
const app = express();
app.use(cors());
// Mount all routes from http endpoints
app.use("/", createIDRouter);
//creates HTTP server
// const httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on ${process.env.SERVERIP}:${HTTP_PORT}`);
});
//websocket server for realtime communication
const wss = new WebSocketServer({ 
    server: httpsServer  // Attach to HTTPS server
});
console.log(`WebSocket server running on ${process.env.WSURL}:${WS_PORT}`);
//on client connection
wss.on("connection", (ws, req) => {
    //get sessionId from URL query
    const { sessionId } = url.parse(req.url, true).query;
    //check to see if sessionId is provided
    if (!sessionId) {
        ws.send("Missing sessionId");
        return ws.close();
    }
    //if the session does not exist, create it
    if(!sessions[sessionId]) sessions[sessionId] = [];
    
    //if ws not in sessions[sessionId], add it
    if(!sessions[sessionId].includes(ws)){
        sessions[sessionId].push(ws);
    }
    console.log("WS client connected:", sessionId);
    //when a message is received
    ws.on("message", (msg) => {
        console.log("WS received:", msg.toString());
        // For now just echo. Later this will route vitals, interventions, etc.
        if(msg == "crew.join"){
          setActive(sessionId);
          return;
        }
        var jsonMSG = JSON.parse(msg);
        for(var i = 0; i < sessions[sessionId].length; i++){
          const client = sessions[sessionId][i];
          if(client !== ws){
            //forward message to other clients in the same session
            client.send(msg.toString());
          } else if (client == ws){
            //acknowledge message receipt to sender
            ws.send("message received");
          }
        }
      if(jsonMSG.type === "session.end"){
          //close all connections in the session
          for(var i = 0; i < sessions[sessionId].length; i++){
                  const client = sessions[sessionId][i];
                  client.send("Session ended by admin");
                  client.close();
                  delete sessions[sessionId];
                  delSessionDoc(sessionId);
                  console.log("Session ended:", sessionId);
                  return;
          }
          //delete the session
      }
      });
  ws.on("close", () => {
    console.log(`WS client disconnected: ${sessionId}`)
    if(sessions[sessionId]){
        //remove ws from sessions[sessionId]
        sessions[sessionId] = sessions[sessionId].filter(client => client !== ws);
        //if no clients left in session, delete the session
        if(sessions[sessionId].length === 0){
            delete sessions[sessionId];
           delSessionDoc(sessionId);
            console.log("Session deleted due to no clients:", sessionId);
        }
    }
});
});
async function setActive(sessionId) {
  const sessionRef = db.collection("sessions").doc(sessionId);
  const batch = db.batch();
  try{  
    batch.update(sessionRef, {
      active: true,
      start: new Date(),
      actionlog: []
    });
    await batch.commit();
    console.log("Session active");
  } catch(error){
    console.log(error);
  }
}
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

    // Build batch
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
