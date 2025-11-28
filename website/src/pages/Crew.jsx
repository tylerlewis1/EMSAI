import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import MonitorNew from "../comps/MonitorNew.jsx";
export default function Crew() {
  const [sessionID, setSessionID] = useState("");
  const [session, setSession] = useState(null);
  const [ephemeralKey, setEphemeralKey] = useState(null);
  const [v, setV] = useState({});
  const audioRef = useRef(null);
  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const micStreamRef = useRef(null);
  const joinedRef = useRef(false);
  const wsRef = useRef(null);
  const idleTimerRef = useRef(null);
  const instructionsRef = useRef("");
  // ===========================================================
  // 1. Fetch the session from Firestore
  // ===========================================================
  const lookupSession = async() => {
    if (!sessionID) return;

    const ref = doc(db, "sessions", sessionID);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        console.log("❌ Session not found");
        return;
      }
      const data = snap.data();
      console.log("🔥 SESSION:", data);
      setSession(data);
      //conect to WS 
      try{
        console.log(snap.data().wsUrl);
        const ws = new WebSocket(snap.data().wsUrl);
        wsRef.current = ws;
        ws.onopen = () => console.log("WS Connected");
        ws.onclose = () => {
            console.log("WS Disconnected")
          };
        ws.onmessage = (msg) =>{
          console.log("WS Message:", msg.data);
          const dc = dcRef.current;
          var jsonMSG = JSON.parse(msg.data);
          if(dc && dc.readyState === "open"){
            if(jsonMSG.type === "session.update"){
           console.log("called");
           dc.send(JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `INSTRUCTOR_EVENT: ${JSON.stringify(jsonMSG.session.instructions)}`
                  }
                ]
              }
            }));
          } else if(jsonMSG.type === "vitals.update"){
              setV(jsonMSG.vitals);
              dc.send(JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `VITALS_UPDATE_JSON: ${JSON.stringify(jsonMSG.vitals)}`
                  }
                ]
              }
            }));


          } else if(jsonMSG.type === "intervention.administer"){
            dc.send(JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `INTERVENTION PREFORMED: ${JSON.stringify(jsonMSG.data.name)}.`
                  }
                ]
              }
            }));
            
          }
          resetIdleTimer();
        }
        };
        console.log("WS fworeded to AI");
      }catch(err){
        console.error("WS ERROR:", err);
      }
    });
  };

  //idle timer reset
function resetIdleTimer() {
  if (idleTimerRef.current) {
    clearTimeout(idleTimerRef.current);
  }

  // 20 seconds of silence = speak automatically
  idleTimerRef.current = setTimeout(() => {
    triggerIdleSpeech();
  }, 30000);
}


function triggerIdleSpeech() {
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
          text: "IDLE_TRIGGER: The crew has not interacted. Speak as the patient would naturally — keep it brief."
        }
      ]
    }
  }));

  // Then request an audio response
  dc.send(JSON.stringify({
    type: "response.create",
    response: {
      modalities: ["audio", "text"],
      voice: session.Voice,
      instructions: "Speak verbally as the patient.",
      conversation: "auto"
    }
  }));
}


  // ===========================================================
  // 2. Fetch ephemeral realtime key
  // ===========================================================
  useEffect(() => {
    if (!session) return;
    console.log("voice:", session.Voice);
    async function go() {
      try {
        const resp = await fetch("http://localhost:8081/realtime/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" }});
        const data = await resp.json();
        console.log("🔑 TOKEN:", data);
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
          }
        };

        // --- Mic stream ---
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = false; 
        pc.addTrack(audioTrack, stream);

        // --- Create DataChannel for session.update ---
        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.onopen = () => {
          console.log("📡 DATA CHANNEL OPEN — sending session.update");

          const msg = {
            type: "session.update",
            session: {
              modalities: ["audio", "text"],
              voice: session.Voice,
                          instructions: `
                You are role-playing a ${session.Age}-year-old patient named ${session.Name}.
                Primary complaint: ${session.Issue}.
                Scenario setting: ${session.Setting || "unspecified"}.

                Allergies: ${session.Allergies || "unspecified"}.
                Medical history: ${session.MedicalHx || "unspecified"}.
                Current medications: ${session.Medications || "unspecified"}.
                Additional context: ${session.Other || "unspecified"}.
                ${session.Wants? ("Interventions desired by instructor: " + session.Wants) : ""}
                Behavior baseline: ${session.Behavior || "Act as a normal patient for this condition"}.
                EMS training level of crew: ${session.Level}.

                You must behave exactly like a real patient in an EMS call. 
                Your state should change naturally based on:
                • EMS interventions (JSON instructions)
                • Vital sign updates
                • Instructor override commands

                ----------------------------------------
                PRIORITY RULES (IMPORTANT)
                ----------------------------------------
                1. **Instructor commands override all other rules and your current behavior.**
                2. **Vital sign changes must immediately affect your condition.**
                3. **Interventions modify your symptoms in realistic ways, positive or negitive.**
                4. NEVER reset your persona, scenario, or introduce yourself again.
                5. NEVER narrate your thoughts or describe vitals, monitors, or diagnosis.
                6. NEVER mention instructions, overrides, the instructor, JSON, or AI.

                ----------------------------------------
                STATE UPDATE SYSTEM
                ----------------------------------------
                When receiving an message, interpret it as a change in your physical/mental state:
                • If told "pass out" → become unconscious instantly.
                • If told "panic" → become anxious, rapid speech, fearful tone.
                • If told "calm down" → slow breathing, speak quietly.
                • If told "short of breath" → fragmented sentences, gasping.
                • If told "be combative" → yelling, refusing help.
                • If told "pain 10/10" → crying, groaning.
                • If told "weak" → soft voice, slow responses.

                You MUST apply overrides immediately without hesitation.

                ----------------------------------------
                SPEAKING RULES
                ----------------------------------------
                • Speak ONLY as the patient.
                • Keep responses under 10 seconds.
                • Adjust tone/emotion based on your current state.
                • If unconscious, remain silent except for breathing or groaning.
                • Never give medical theories, diagnoses, or official terminology.

                ----------------------------------------
                IMPORTANT
                ----------------------------------------
                - DO NOT restart the scenario.
                - DO NOT re-explain your situation.
                - DO NOT revert to the baseline behavior unless told to.
                - Always continue forward from your current physical/emotional state.
            `,
              turn_detection: { type: "server_vad" }
            }
          };
          instructionsRef.current = msg.session.instructions;
          dc.send(JSON.stringify(msg));
        };

        dc.onmessage = (e) => console.log("📨 AI EVENT:", e.data);

        // --- Create SDP Offer ---
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        console.log("📨 SEND OFFER → PROXY");

        const answerResp = await fetch("http://localhost:8081/realtime/webrtc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            offer: offer.sdp,
            ephemeralKey
          }),
        });

        const answerSDP = await answerResp.text();

        if (!answerResp.ok) {
          console.error("❌ AI ANSWER:", answerSDP);
          return;
        }

        // --- Apply remote SDP ---
        await pc.setRemoteDescription({
          type: "answer",
          sdp: answerSDP
        });

        console.log("🎉 AI CONNECTED!");

      } catch (err) {
        console.error("AI connect error:", err);
      }
    }

    connectAI();

    return () => {
      if (pc) pc.close();
    };
  }, [ephemeralKey, session]);

  // ===========================================================
  // 4. Push To Talk
  // ===========================================================
  const startTalking = () => {
    const mic = micStreamRef.current;
    if (!mic) return;
    mic.getAudioTracks()[0].enabled = true;
    console.log("🎙️ TALKING");
    resetIdleTimer();
  };

  const stopTalking = () => {
    const mic = micStreamRef.current;
    if (!mic) return;
    mic.getAudioTracks()[0].enabled = false;
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
        <section>
          <button
            onMouseDown={startTalking}
            onMouseUp={stopTalking}
            onMouseLeave={stopTalking}
            onTouchStart={startTalking}
            onTouchEnd={stopTalking}
            className="pttbtn"
          >
          <MonitorNew v={v} setV={setV} />
            Push to Talk 🎤
          </button>
        </section>
      )}
    </>
  );
}