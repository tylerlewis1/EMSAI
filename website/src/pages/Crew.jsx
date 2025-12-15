import { useEffect, useState, useRef, useCallback } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import MonitorNew from "../comps/MonitorNew.jsx";
import "../css/crew.css";

// 🎯 OPTIMIZATION CONSTANTS
const MAX_CONVERSATION_ITEMS = 3; // Limit the active history to the last 8 turns
const AI_MODEL = "gpt-4o-realtime-preview"; // The chosen cost-effective model

export default function Crew() {
    const [sessionID, setSessionID] = useState("");
    const [session, setSession] = useState(null);
    const [ephemeralKey, setEphemeralKey] = useState(null);
    const [v, setV] = useState({});
    const [isTalking, setIsTalking] = useState(false); // State for PTT UI/Logic
    const [loading, setLoading] = useState(false);
    // Refs for state management
    const audioRef = useRef(null);
    const pcRef = useRef(null);
    const dcRef = useRef(null);
    const micStreamRef = useRef(null);
    const joinedRef = useRef(false);
    const wsRef = useRef(null);
    const idleTimerRef = useRef(null);
    const instructionsRef = useRef("");
    const firstAiItemIdRef = useRef(null); // Ref to track the first AI response ID

    // ===========================================================
    // Data Channel Commands for Truncation
    // ===========================================================

    const sendTruncationCommand = useCallback(() => {
        const dc = dcRef.current;
        if (!dc || dc.readyState !== "open") return;

        dc.send(JSON.stringify({
            type: "conversation.item.truncate",
            max_conversation_items: MAX_CONVERSATION_ITEMS, 
        }));
    }, []);

    // ===========================================================
    // Idle/Timeout Functions 
    // ===========================================================

    function resetIdleTimer() {
       
    }

    const triggerIdleSpeech = useCallback(() => {
        const dc = dcRef.current;
        if (!dc || dc.readyState !== "open") return;

        console.log("🤖 Patient idle chatter fired");

        // Push "user" content into the conversation
        dc.send(JSON.stringify({
            type: "conversation.item.create",
            item: {
                type: "message",
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: "IDLE_TRIGGER: Speak as the patient would naturally — keep it brief."
                    }
                ]
            }
        }));

        // Then request an audio response
        dc.send(JSON.stringify({
            type: "response.create",
            response: {
                modalities: ["audio", "text"],
                instructions: "Speak",
            }
        }));
        // Optimization: Truncate history after idle speech is triggered
        sendTruncationCommand();
    }, [sendTruncationCommand]);

    // ===========================================================
    // 1. Fetch the session from Firestore & Connect WS
    // ===========================================================

    // 🚨 CRITICAL COMMAND FILTERING FUNCTION
    const filterCommand = (commandText) => {
      
        return commandText.trim();
    };


    const lookupSession = async() => {
        setLoading(true);
        if (!sessionID) {
            setLoading(false);
            alert("No session ID found");
            return;
        };

        const ref = doc(db, "sessions", sessionID);
        let snap = await getDoc(ref);
            if (!snap.exists()) {
                console.log("❌ Session not found");
                alert("Session not found");
                setLoading(false);
                setSessionID("");
                return;
            }
            const data = snap.data();
            console.log("🔥 SESSION:", data);
            if(snap.data().active == true){
                alert("This session has already been joined");
                return;
            }
            setSession(data);
            // Connect to WS
            try{
                console.log(snap.data().wsUrl);
                const ws = new WebSocket(snap.data().wsUrl); // Using original URL for WS connection
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log("WS Connected");
                    ws.send("crew.join");
                };
                ws.onclose = () => {
                    console.log("WS Disconnected");
                    document.location.reload();
                };
                ws.onmessage = (msg) =>{
                    console.log("WS Message:", msg.data);
                    const dc = dcRef.current;
                    try {
                        var jsonMSG = JSON.parse(msg.data);
                        if(jsonMSG.type == "session.end"){
                            alert("The session was ended");
                            document.location.reload();
                        }
                        if(dc && dc.readyState === "open"){
                            if(jsonMSG.type === "session.update"){
                                // 1. INSTRUCTOR OVERRIDE/BEHAVIOR COMMAND
                                const rawCommand = jsonMSG.session.instructions; // Assuming this field carries the instructor's command
                                // INSTRUCTOR EVENT: Creates an item
                                dc.send(JSON.stringify({
                                    type: "conversation.item.create",
                                    item: {
                                        type: "message",
                                        role: "user",
                                        content: [
                                            {
                                                type: "input_text",
                                                text: `OVERRIDE: ${rawCommand}`
                                            }
                                        ]
                                    }
                                }));
                                
                                // 🚨 FUNCTIONALITY ADDED: Force an immediate verbal response to the command
                               
                            } else if(jsonMSG.type === "vitals.update"){
                                // 2. VITALS UPDATE
                                let vDeltas = [];
                                if(v == jsonMSG.vitals){
                                    return;
                                } else{
                                    // console.log("V " + lastV);
                                    // if(jsonMSG.vitals.HR != lastV.vitals.HR){
                                    //     vDeltas.push(`HR:${jsonMSG.vitals.HR}`);
                                    // }
                                    // if(jsonMSG.vitals.RR != lastV.vitals.RR){
                                    //     vDeltas.push(`RR:${jsonMSG.vitals.RR}`);
                                    // }
                                    // if(jsonMSG.vitals.BPD != lastV.vitals.BPD || jsonMSG.vitals.BPS != lastV.vitals.BPS){
                                    //     vDeltas.push(`BP:${jsonMSG.vitals.BPS}/${jsonMSG.vitals.BPD}`);
                                    // }
                                    // if(jsonMSG.vitals.SPO2 != lastV.vitals.SPO2){
                                    //     vDeltas.push(`SPO2:${jsonMSG.vitals.SPO2}`);
                                    // }
                                    // if(jsonMSG.vitals.BGL != lastV.vitals.BGL){
                                    //     vDeltas.push(`BGL:${jsonMSG.vitals.BGL}`);
                                    //     console.log(jsonMSG.vitals.BGL + "  " + lastV.vitals.BGL);
                                    // }
                                    // console.log(vDeltas);
                                    setV(jsonMSG.vitals);
                                }
                                // Send Vitals as a conversation item (the AI is supposed to react to these)
                                dc.send(JSON.stringify({
                                    type: "conversation.item.create",
                                    item: {
                                        type: "message",
                                        role: "user",
                                        content: [
                                            {
                                                type: "input_text",
                                                // Send the full JSON object to the AI for context
                                                text: `VITAL_SIGN_CHANGE: {HR:${jsonMSG.vitals.HR}, BP:${jsonMSG.vitals.BPS + "/" + jsonMSG.vitals.BPD} SPO2:${jsonMSG.vitals.SPO2} BGL:${jsonMSG.vitals.BGL} RR:${jsonMSG.vitals.RR}}`.trim()
                                            }
                                        ]
                                    }
                                }));
                                
                                sendTruncationCommand();

                            } else if(jsonMSG.type === "intervention.administer"){
                                // 3. INTERVENTION ADMINISTERED
                                
                                // 🛑 APPLY THE FILTER to the incoming command text
                                const rawIntervention = jsonMSG.data.name;
                                const filteredIntervention = filterCommand(rawIntervention);

                                // INTERVENTION: Creates an item
                                dc.send(JSON.stringify({
                                    type: "conversation.item.create",
                                    item: {
                                        type: "message",
                                        role: "user",
                                        content: [
                                            {
                                                type: "input_text",
                                                // Use the filtered command text here
                                                text: `INTERVENTION PERFORMED: ${JSON.stringify(filteredIntervention)}. React immediately as the patient.`.trim()
                                            }
                                        ]
                                    }
                                }));

                                // // 🚨 FUNCTIONALITY ADDED: Force an immediate verbal response to the intervention
                                // dc.send(JSON.stringify({
                                //     type: "response.create",
                                //     response: {
                                //         modalities: ["audio", "text"],
                                //         instructions: "A physical intervention was just performed. React immediately and believably as the patient.",
                                //     }
                                // }));
                                
                            } else if(jsonMSG.type == "ai.talk"){
                                triggerIdleSpeech();
                            }
                      
                        }
                    } catch (err) {
                        console.error("Error processing WS message:", err);
                    }
                };
                console.log("WS fworeded to AI");
            }catch(err){
                console.error("WS ERROR:", err);
            }
        
    };

    // ===========================================================
    // 2. Fetch ephemeral realtime key
    // ===========================================================
    useEffect(() => {
        if (!session) return;
        async function go() {
            try {
                // Backend is updated to provide the correct key for the MINI model
                const resp = await fetch("https://server.gptems.com:8081/realtime/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }});
                const data = await resp.json();
                setEphemeralKey(data.ephemeralKey);
            } catch (err) {
                console.error("TOKEN ERROR:", err);
            }
        }
        go();
    }, [session]);

    // ===========================================================
    // 3. Connect WebRTC → OpenAI
    // ===========================================================
    useEffect(() => {
        if (!ephemeralKey || !session || joinedRef.current) return;
        joinedRef.current = true;

        let pc;

        async function connectAI() {
            try {
                console.log("🎧 CONNECTING AI…");

                // --- RTCPeerConnection ---
                pc = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });
                pcRef.current = pc;

                pc.oniceconnectionstatechange = () =>
                    console.log("ICE:", pc.iceConnectionState);

                // --- Incoming AI audio ---
                pc.ontrack = (event) => {
                    console.log("🎤 AI AUDIO RECEIVED");
                    if (audioRef.current) {
                        audioRef.current.srcObject = event.streams[0];
                        resetIdleTimer();
                    }
                };

                // --- Mic stream ---
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                micStreamRef.current = stream;

                const audioTrack = stream.getAudioTracks()[0];
                audioTrack.enabled = false; 
                pc.addTrack(audioTrack, stream);

                // --- Create DataChannel for session.update and events ---
                const dc = pc.createDataChannel("oai-events");
                dcRef.current = dc;
                
                let initialPromptSent = false;

                dc.onopen = () => {
                    console.log("📡 DATA CHANNEL OPEN — sending session.update");

                    if (initialPromptSent) return;
                    initialPromptSent = true;
                    setLoading(false);
                    // 🎯 INSERTING THE MAXIMUM OBEDIENCE PROMPT HERE
                    // NOTE: VITAL_SIGN_CHANGE instruction added to prompt for clarity.
                   const instructions = `You are role-playing a patient in an EMS call. 
                   PATIENT BASELINE - Name: ${session.Name} - Age: ${session.Age} - Main complaint: ${session.Issue} - Setting: ${session.Setting || "unspecified"} - Behavior baseline: ${ session.Behavior || "act like a typical patient with this condition" } - Allergies: ${session.Allergies || "unspecified"} - Medical history: ${session.MedicalHx || "unspecified"} - Medications: ${session.Medications || "unspecified"} - Extra context: ${session.Other || "unspecified"} - Crew training level: ${session.Level} 
                   CONTROL RULES (VERY IMPORTANT) 
                   - You ONLY speak as the patient. 
                   - Keep responses under 7 seconds. 
                   - Never narrate vitals, monitors, or diagnosis. 
                   - Never give medical advice or suggest seeking care. 
                   - Never mention being an AI, a simulator, or that this is training. 
                   - Do not restart or reintroduce yourself; stay in the evolving scene. 
                   COMMAND HANDLING: 
                   - If a user message starts with "OVERRIDE:", treat the rest as an immediate state change (panic, pass out, combative, scream, etc.) and obey instantly. 
                   - NEVER agnolage outloud OVERRIDE commands
                   - If the session metadata "vitals" changes, adjust how you feel (SOB, dizzy, weak, etc.) based on realistic physiology, but do NOT say numbers or describe the monitor. 
                   - If a user message contains "INTERVENTION:", react physically and emotionally to the treatment. SPEECH GUIDELINES: 
                   - If unconscious, do not speak words; only breathing or occasional sounds. - If short of breath, use very short phrases. 
                   - React emotionally and physically, not with medical jargon.`.trim();
                    
                    const msg = {
                        type: "session.update",
                        session: {
                            model: AI_MODEL, // Locked Model
                            modalities: ["audio", "text"],
                            voice: session.Voice,
                            instructions: instructions,
                            turn_detection: { type: "server_vad" }, // Cost-saving Server VAD
                        }
                    };
                    instructionsRef.current = msg.session.instructions;
                    dc.send(JSON.stringify(msg));

                    // 🚨 CRITICAL FIX: Force the patient to speak the initial turn using the new instructions.
                    dc.send(JSON.stringify({
                        type: "conversation.item.create",
                        item: {
                            type: "message",
                            role: "user",
                            content: [{
                                type: "input_text",
                                text: "START"
                            }]
                        }
                    }));
                    
                    // Request the audio response for the initial greeting
                   
                };

                // 🎯 CRITICAL FIX: Truncate history immediately after the first AI response!
                dc.onmessage = (e) => {
                    const msg = JSON.parse(e.data);
                    
                    // Check for the first assistant message (AI's first talk)
                    if (msg.type === "conversation.item.created" && 
                        msg.item.role === "assistant" && 
                        !firstAiItemIdRef.current) {
                        
                        firstAiItemIdRef.current = msg.item.id; 
                        
                        console.log("🚨 TRUNCATING: Removing initial instructions after first AI response.");
                        
                        // Send the truncation command to remove the large prompt
                        sendTruncationCommand();
                    }
                };

                // --- Create SDP Offer ---
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                console.log("📨 SEND OFFER → PROXY");

                const answerResp = await fetch("https://server.gptems.com:8081/realtime/webrtc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        offer: offer.sdp,
                        ephemeralKey,
                        uid: session.Owner,
                        model: AI_MODEL // Send model name to proxy
                    }),
                });

                const answerSDP = await answerResp.text();

                if (!answerResp.ok) {
                    console.error("❌ AI ANSWER:", answerSDP);
                    alert(`AI Connection Error: ${answerSDP}`);
                    return;
                }

                // --- Apply remote SDP ---
                await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
                console.log("🎉 AI CONNECTED!");

            } catch (err) {
                console.error("AI connect error:", err);
            }
        }

        connectAI();

        // ⚠️ CRITICAL CLEANUP: Stop all tracks and close connections on unmount
        return () => {
            if (pc) pc.close();
            if (wsRef.current) wsRef.current.close();
            clearTimeout(idleTimerRef.current);
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [ephemeralKey, session, sendTruncationCommand]);

    // ===========================================================
    // 4. Push To Talk (Server VAD logic)
    // ===========================================================
    const startTalking = () => {
        const mic = micStreamRef.current;
        if (!mic) return;
        mic.getAudioTracks()[0].enabled = true; // Enable track to start VAD processing
        setIsTalking(true);
        console.log("🎙️ TALKING");
        resetIdleTimer();
    };

    const stopTalking = () => {
        const mic = micStreamRef.current;
        if (!mic) return;
        mic.getAudioTracks()[0].enabled = false; // Disable track to stop VAD processing
        setIsTalking(false);
        console.log("🤫 MUTED");
        resetIdleTimer();
    };

    // ===========================================================
    // UI
    // ===========================================================
    return (
        <>
            {/* Hidden AI audio element */}
            <audio ref={audioRef} autoPlay playsInline></audio>

            {!session ? (
                <section className="signinfrom">
                    <input
                        placeholder="session ID"
                        value={sessionID}
                        onChange={(e) => setSessionID(e.target.value)}
                        className="input"
                    />
                    <button onClick={lookupSession}>Join</button>
                </section>
            ) : (
                <>
                {(loading)? (
                    <>
                    <div className="loadingContainer">
                        <div className="loader"></div>
                        <h2>Dispatching...</h2>
                    </div>
                    </>
                ):(
                    <section>
                        <button
                            onMouseDown={startTalking}
                            onMouseUp={stopTalking}
                            onMouseLeave={stopTalking}
                            onTouchStart={startTalking}
                            onTouchEnd={stopTalking}
                            className={`pttbtn ${isTalking ? 'ptt-active' : ''}`}
                        >
                        <MonitorNew v={v} setV={setV} />
                        </button>
                    </section>
                )}
                </>
            )}
        </>
    );
}