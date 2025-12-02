import { useEffect, useRef } from "react"
import { data } from "react-router-dom";
import Create from "../comps/CreateModal";
import "../css/sessions.css";
import { useNavigate } from "react-router-dom";
export default function Sessions({Data}){
    const nav = useNavigate();
    const sessions = useRef();
    const credits = useRef();
    credits.current = Data.Credits;
    sessions.current = Data.Sessions;
    console.log(credits.current);
    return(
        <div className="session-list">
        {!(sessions.current.length > 0) ? (
            <h2 style={{textAlign: "center", padding: 50}}>No acitve sessions</h2>   
        ):(
            <>
                {sessions.current.map((session) => {
                    return(
                        <div onClick={()=> {nav("/instructor",  { state: { ID: session.ID } })}}className="session">
                            <h1>{session.NAME}</h1>
                            <br/>
                            <p>Session ID: {session.ID}</p>
                            <p>Crew link: https://gptems.com/crew</p>
                        </div>
                    )
                })}
                </>
            )
            
        }
        {(credits.current > 0) ? (
            <Create/>
        ): (
            <button style={{backgroundColor: "red", color: "white", width: "100%"}} className="btn">You are all out of credits, get more!</button>
        )}
        
        </div>
    )
}