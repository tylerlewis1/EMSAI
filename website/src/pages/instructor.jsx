import { useState, useRef, useEffect } from "react";
import { db, auth } from "../firebase.js";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate, useLocation, data  } from "react-router-dom";
import "../css/instructor.css"; // SCOPED USING .instructor-page WRAPPER
import ActionLog from "../comps/ActionLog.jsx";
export default function Instructor() {
  const location = useLocation();
  const { ID } = location.state || "";
  const [sessionId, setSessionId] = useState(ID);
  const [message, setMessage] = useState("");
  const [intervention, setIntervention] = useState("");
  const [sessionData, setSessionData] = useState(null);
  const [dose, setDose] = useState(null);
 
  const navigate = useNavigate();
  const wsRef = useRef(null);

  // --------------------------
  // JOIN SESSION
  // --------------------------
  useEffect(() =>{
    if(ID != null){
      setSessionId(ID);
      join();
    }
  },[])
  const join = async () => {
    try {
      const sessionRef = doc(db, "sessions", sessionId);
      const snap = await getDoc(sessionRef);

      if (!snap.exists()) throw new Error("Session does not exist!");

      const data = snap.data();
      setSessionData(data);
      const ws = new WebSocket(`wss://server.gptems.com:8081?sessionId=${sessionId}`);
      // const ws = new WebSocket(`ws://192.168.27.155:8080?sessionId=${sessionId}`);

      wsRef.current = ws;

      ws.onopen = () => console.log("WS Connected");
      ws.onclose = () => navigate("/dash");
      ws.onmessage = (msg) => console.log("WS Message:", msg.data);

    } catch (err) {
      console.error("JOIN ERROR:", err);
      alert("Session not found!");
    }
  };
  //update log

  const addToLog = async(data) =>{
    try{
      const sessionRef = doc(db, "sessions", sessionId);
      await updateDoc(sessionRef, {
        actionlog: arrayUnion({
          name: data,
          time: new Date()
        })
      });
    }catch(error){
      console.log(error);
    }
  }
  // --------------------------
  // SEND: VITALS UPDATE
  // --------------------------
  const updateVitals = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        type: "vitals.update",
        vitals: {
          HR: sessionData.HR,
          BPS: sessionData.BPS,
          BPD: sessionData.BPD,
          RR: sessionData.RR,
          SPO2: sessionData.SPO2,
          CAP: sessionData.CAP,
          EKG: sessionData.EKG,
          BGL: sessionData.BGL,
        },
      })
    );
    addToLog(`Vitals: HR: ${sessionData.HR}, BP: ${sessionData.BPS + "/" + sessionData.BPD}, RR: ${sessionData.RR}, SPO2: ${sessionData.SPO2}, BGL: ${sessionData.BGL}, EKG: ${sessionData.EKG}`);
    console.log("Vitals Pushed");
  };

  // --------------------------
  // SEND: INTERVENTION
  // --------------------------
  const sendIntervention = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "intervention.administer",
        data: { name: intervention + (dose ? ` — ${dose}` : "") },
      })
    );
    addToLog(`Intervention: ${intervention} ${dose}`);
    setDose("");
    setIntervention("");
    console.log("Intervention sent");
  };

  // --------------------------
  // SEND: BEHAVIOR COMMAND
  // --------------------------
  const suggestBehavior = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "session.update",
        session: { 
          instructions: message 
        },
      })
    );
    setMessage("");
    addToLog(`Command: ${message}`);
    console.log("Behavior suggestion sent");
  };
  //nudge
  const nudge = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "ai.talk",
      })
    );
    addToLog(`Nudged`);
    console.log("nudged");
  };

  //report
  const report = async() =>{
    const resp = await fetch("https://server.gptems.com:8081/report", {
        method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: auth.currentUser.uid,
              sid: sessionId
            })
        });
      const pdfBlob = await resp.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

  }
  // --------------------------
  // END SESSION
  // --------------------------
  const endSession = async() => {
    const ws = wsRef.current;
    await report().then(() =>{
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: "session.end" }));
      console.log("Session ended");
    });
  };

  return (
    <div className="instructor-page">
      {!sessionData ? (
        <div className="admin-login">
          <h2>Join Simulation</h2>

          <input
            type="text"
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />

          <button onClick={join}>Join Session</button>
        </div>
      ) : (
        <div className="admin-dashboard">
          <h1>Instructor Dashboard</h1>
          <p className="session-id">Session ID: {sessionId}</p>

          <div className="grid-3">

            {/* VITALS PANEL */}
            <div className="card">
              <h2>Vitals Control</h2>

              {["HR", "BPS", "BPD", "RR", "SPO2", "CAP", "BGL"].map((v) => (
                <div className="vital-row" key={v}>
                  <label>{v}: {sessionData[v]}</label>

                  <input
                    type="range"
                    min="0"
                    max={v === "SPO2" ? 100 : 200}
                    value={sessionData[v]}
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        [v]: Number(e.target.value),
                      })
                    }
                  />
                </div>
              ))}
              <select value={sessionData.EKG} onChange={(e) =>{setSessionData({...sessionData, EKG: e.target.value})}}>
                <option value="normal">Normal Sinus Rhythm</option>
                {/* <option value="afib">Atrial Fibrillation</option> */}
                <option value="pvc">Premature Ventricular Contractions</option>
                <option value="vtach">Ventricular Tachycardia</option>
                <option value="vfib">Ventricular Fibrillation</option>
                <option value="asystole">Asystole</option>
                <option value="svt">Supraventricular Tachycardia</option>
                <option value="brady">Bradycardia</option>
                <option value="pollymorphic">Polymorphic Tachycardia</option>
                <option value="junctional">Junctional</option>
              </select>
              <button className="btn-green" onClick={updateVitals}>
                Push Vitals Update
              </button>
            </div>

            {/* INTERVENTIONS */}
            <div className="card">
              <h2>Interventions</h2>

             <select
  value={intervention}
  onChange={(e) => setIntervention(e.target.value)}
>
  <option value="">Select Intervention</option>

                {/* ------------------------------ */}
                {/* AIRWAY MANAGEMENT */}
                {/* ------------------------------ */}
                <optgroup label="Airway Management">
                  <option value="Manual Airway Positioning">Manual Airway Positioning</option>
                  <option value="Suctioning">Suctioning</option>
                  <option value="OPA Insertion">OPA Insertion</option>
                  <option value="NPA Insertion">NPA Insertion</option>
                  <option value="BVM Ventilation">BVM Ventilation</option>
                  <option value="iGel Insertion">iGel Insertion</option>
                  <option value="King Airway Insertion">King Airway Insertion</option>
                  <option value="ET Intubation">ET Intubation</option>
                  <option value="Video Laryngoscopy">Video Laryngoscopy</option>
                  <option value="Needle Cricothyrotomy">Needle Cricothyrotomy</option>
                  <option value="Surgical Cricothyrotomy">Surgical Cricothyrotomy</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* BREATHING & OXYGENATION */}
                {/* ------------------------------ */}
                <optgroup label="Breathing & Oxygenation">
                  <option value="Oxygen Nasal Cannula">Oxygen — Nasal Cannula</option>
                  <option value="Oxygen Nonrebreather">Oxygen — Nonrebreather</option>
                  <option value="Nebulizer Treatment">Nebulizer Treatment</option>
                  <option value="CPAP">CPAP</option>
                  <option value="BiPAP">BiPAP</option>
                  <option value="Albuterol Nebulizer">Albuterol Nebulizer</option>
                  <option value="Ipratropium (Atrovent) Nebulizer">Ipratropium (Atrovent)</option>
                  <option value="Epinephrine Nebulized">Epinephrine Nebulized</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* CIRCULATION / CARDIAC */}
                {/* ------------------------------ */}
                <optgroup label="Cardiac / Circulation">
                  <option value="CPR">CPR</option>
                  <option value="Defibrillation">Defibrillation</option>
                  <option value="Synchronized Cardioversion">Synchronized Cardioversion</option>
                  <option value="Transcutaneous Pacing">Transcutaneous Pacing</option>
                  <option value="12-Lead ECG">12-Lead ECG</option>
                  <option value="IV Fluids">IV Fluids</option>
                  <option value="IV Access">IV Access</option>
                  <option value="IO Access">IO Access</option>
                  <option value="Bleeding Control">Bleeding Control</option>
                  <option value="Tourniquet Application">Tourniquet Application</option>
                  <option value="Wound Packing">Wound Packing</option>
                  <option value="Pelvic Binder">Pelvic Binder</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* CARDIAC MEDICATIONS */}
                {/* ------------------------------ */}
                <optgroup label="Cardiac Medications">
                  <option value="Aspirin">Aspirin</option>
                  <option value="Nitroglycerin">Nitroglycerin</option>
                  <option value="Epinephrine 1:10,000 (Cardiac Arrest)">Epinephrine 1:10,000</option>
                  <option value="Amiodarone">Amiodarone</option>
                  <option value="Lidocaine">Lidocaine</option>
                  <option value="Adenosine">Adenosine</option>
                  <option value="Atropine">Atropine</option>
                  <option value="Dopamine">Dopamine Infusion</option>
                  <option value="Push Dose Epi">Push Dose Epinephrine</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* RESPIRATORY MEDICATIONS */}
                {/* ------------------------------ */}
                <optgroup label="Respiratory Medications">
                  <option value="Albuterol">Albuterol</option>
                  <option value="Atrovent">Atrovent (Ipratropium)</option>
                  <option value="Epinephrine 1:1,000">Epinephrine 1:1,000</option>
                  <option value="Magnesium Sulfate (Asthma)">Magnesium Sulfate</option>
                  <option value="Solu-Medrol">Solu-Medrol</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* NEURO / AMS / SEIZURE */}
                {/* ------------------------------ */}
                <optgroup label="Neurology / AMS">
                  <option value="Oral Glucose">Oral Glucose</option>
                  <option value="IV Dextrose">Dextrose IV</option>
                  <option value="Glucagon">Glucagon</option>
                  <option value="Narcan">Narcan (Naloxone)</option>
                  <option value="Versed">Midazolam (Versed)</option>
                  <option value="Keppra (If allowed)">Keppra</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* PAIN CONTROL / SEDATION */}
                {/* ------------------------------ */}
                <optgroup label="Pain / Sedation">
                  <option value="Fentanyl">Fentanyl</option>
                  <option value="Morphine">Morphine</option>
                  <option value="Ketamine Analgesia">Ketamine — Analgesia</option>
                  <option value="Ketamine Sedation">Ketamine — Sedation</option>
                  <option value="Etomidate">Etomidate</option>
                  <option value="Propofol">Propofol (RSI only)</option>
                  <option value="Nitrous Oxide">Nitrous Oxide</option>
                  <option value="Versed">Versed</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* TRAUMA CARE */}
                {/* ------------------------------ */}
                <optgroup label="Trauma">
                  <option value="C-Collar">C-Collar</option>
                  <option value="Backboard">Long Backboard</option>
                  <option value="Chest Seal">Chest Seal</option>
                  <option value="Decompression Needle">Needle Decompression</option>
                  <option value="Splinting">Splinting</option>
                  <option value="Traction Splint">Traction Splint</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* OB / PEDIATRICS */}
                {/* ------------------------------ */}
                <optgroup label="OB / Pediatrics">
                  <option value="OB Delivery Assistance">Delivery Assistance</option>
                  <option value="Newborn Warming/Drying">Newborn Warming</option>
                  <option value="Neonatal BVM">Neonatal BVM</option>
                  <option value="Pediatric Dose Epi">Pediatric Epinephrine</option>
                  <option value="Pediatric Dextrose">Pediatric Dextrose</option>
                </optgroup>

                {/* ------------------------------ */}
                {/* ENVIRONMENTAL / OTHER */}
                {/* ------------------------------ */}
                <optgroup label="Environmental / Other">
                  <option value="Active Warming">Active Warming</option>
                  <option value="Active Cooling">Active Cooling</option>
                  <option value="Decontamination">Decontamination</option>
                  <option value="Burn Care">Burn Care</option>
                </optgroup>

              </select>
              <input
                type="text"
                placeholder="Dose (if applicable) must add unit"
                value={dose}
                style={{width: "calc(100% - 20px)", marginTop: "10px"}}
                onChange={(e) => setDose(e.target.value)}
              />
              <button className="btn-yellow" onClick={sendIntervention}>
                Administer Intervention
              </button>
              <ActionLog sessionID={{sessionId}}/>
            </div>

            {/* BEHAVIOR COMMAND */}
            <div className="card">
              <h2>Behavior Command</h2>

              <textarea
                placeholder="Tell the patient how to act…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button className="btn-blue" onClick={suggestBehavior}>
                Send Behavior Cue
              </button>
              <button className="btn-blue" onClick={nudge}>
                Nudge
              </button>
              <button className="btn-red" onClick={endSession}>
                End Session
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
