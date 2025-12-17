import { useState } from "react";
import "../css/create.css";
import {auth} from "../firebase";
export default function Create() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [issue, setIssue] = useState();
    const [other, setOther] = useState();
    const [voice, setVoice] = useState("alloy");
    const [behavior, setBehavior] = useState();
    const [setting, setSetting] = useState();
    const [medicalHx, setMedicalHx] = useState();
    const [medications, setMedications] = useState();
    const [level, setLevel] = useState("EMT basic");
    const [sessionID, setSessionID] = useState();
    const [allergies, setAllergies] = useState();
    const [wants, setWants] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const url = "https://server.gptems.com:8081/create";
    const onClose = () =>{
        setIsOpen(false);
    }
    const CreateSession = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: name,
                    Age: age,
                    Issue: issue,
                    Other: other,
                    Behavior: behavior,
                    Level: level,
                    Voice: voice,
                    Setting: setting,
                    MedicalHx: medicalHx,
                    Medications: medications,
                    Allergies: allergies,
                    Wants: wants,
                    UserUID: auth.currentUser.uid,
                })
            });

            const data = await res.json();
            setSessionID(data.sessionId);
            
        } catch (error) {
            console.error("Error creating session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSessionID(null);
        setName("");
        setAge("");
        setIssue("");
        setOther("");
        setBehavior("");
        setSetting("");
        setMedicalHx("");
        setMedications("");
        setAllergies("");
        setWants("");
        setVoice("alloy");
        setLevel("EMT basic");
        onClose();
    };

    if (!isOpen){ 
        return(
            <>
                <button className="create-button" style={{margin: "auto", display: "block", width: "100%"}} onClick={() => {setIsOpen(true)}}>Create Scenario</button>
            </>
        );
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h1>Create Scenario</h1>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                <form className="create-form" onSubmit={(event) => CreateSession(event)} > 
                    <div className="form-grid">
                        <input t required="true" ype="text" placeholder="Patient Name" value={name || ""} onChange={(e) => setName(e.target.value)} />
                        <input type="text" placeholder="Age" value={age || ""} onChange={(e) => setAge(e.target.value)} />
                        <input type="text" placeholder="Chief Complaint" value={issue || ""} onChange={(e) => setIssue(e.target.value)} />
                        <input type="text" placeholder="Other Info" value={other || ""} onChange={(e) => setOther(e.target.value)} />
                        <input type="text" placeholder="Behavior" value={behavior || ""} onChange={(e) => setBehavior(e.target.value)} />
                        <input type="text" placeholder="Setting" value={setting || ""} onChange={(e) => setSetting(e.target.value)} />
                        <input type="text" placeholder="Medical History" value={medicalHx || ""} onChange={(e) => setMedicalHx(e.target.value)} />
                        <input type="text" placeholder="Current Medications" value={medications || ""} onChange={(e) => setMedications(e.target.value)} />
                        <input type="text" placeholder="Allergies" value={allergies || ""} onChange={(e) => setAllergies(e.target.value)} />
                        <input type="text" placeholder="What interventions are you looking for the crew to do?" value={wants || ""} onChange={(e) => setWants(e.target.value)} />
                        
                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="EMT basic">EMT-B</option>
                            <option value="Advanced EMT">Advanced EMT</option>
                            <option value="Paramedic">Paramedic</option>
                        </select>

                        <select value={voice} onChange={(e) => setVoice(e.target.value)}>
                            <option value="alloy">Alloy (Female)</option>
                            <option value="ash">Ash (Male)</option>
                            <option value="ballad">Ballad (British Male)</option>
                            <option value="coral">Coral (Female)</option>
                            <option value="echo">Echo (Male)</option>
                            <option value="sage">Sage (Female)</option>
                            <option value="shimmer">Shimmer (Female)</option>
                            <option value="verse">Verse (Male)</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="create-button"
                        >
                            {isLoading ? "Creating..." : "Create Session"}
                        </button>
                    </div>

                    {sessionID && (
                        <div className="session-result">
                            <h3>Session Created: {sessionID}</h3>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
