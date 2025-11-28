import { useState } from "react";
import "../css/create.css";

export default function Create() {
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
    const url = "http://localhost:8081/create";

    const CreateSession = async () => {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Name: name,
                Gender: "male",
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
                Wants: wants
            })
        });

        const data = await res.json();
        setSessionID(data.sessionId);
    };

    return (
        <div className="create-page">
            <h1>Create Scenario</h1>

            <section className="create-form">
                <input type="text" placeholder="Patient Name" value={name || ""} onChange={(e) => setName(e.target.value)} />
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

                <button onClick={CreateSession}>Create Session</button>

                <h3>{sessionID}</h3>

                {sessionID && (
                    <div className="create-links">
                        <a href="/crew">Go to Crew</a>
                        <a href="/admin">Go to Admin</a>
                    </div>
                )}
            </section>
        </div>
    );
}
