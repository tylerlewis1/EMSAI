import { useState } from "react";
import "../css/feedback.css";
import { auth } from "../firebase";
export default function Feedback(){
    const [msg, setMsg] = useState("");
    const sendFeedback = async() =>{
        try {
            const response = await fetch("https://formspree.io/f/mblnaglp", {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                email: auth.currentUser.email,
                msg: msg,
                type: "feedback",
                subject: "GPTEMS Feedback",
                _subject: "New Feedback"
                })
            });
        if (response.ok) {
            alert("Thank you for the feedback! We will work on making changes!");
            setMsg("");
        } else {
            throw new Error('Form submission failed');
        }
        } catch (error) {
            alert("There was a issue processing your request. Please send a email to our admin at tglewis247@gmai.com");
            console.error('Waitlist submission error:', error);
        } 
    };
    
    return(
    <>
        <div className="card">
            <div className="header">
                <h1>Feedback</h1>
                <p>Send feedback to help us improve our system</p>
            </div>
            <div>
                <textarea className="text" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                <button style={{backgroundColor: "#1e293b", color: "white"}}className="btn" onClick={() => sendFeedback()}>Submit</button>
            </div>
        </div>
    </>
    );
}
