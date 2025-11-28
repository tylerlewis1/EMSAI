import { useEffect, useRef } from "react"
import { data } from "react-router-dom";
import Create from "../comps/CreateModal";
import "../css/sessions.css";
import { useNavigate } from "react-router-dom";
export default function Sessions({Data}){
    const nav = useNavigate();
    const sessions = useRef();
    sessions.current = Data.Sessions;
    return(
        <div className="session-list">
        {!(1 > 0)? (
            <h1>No acitve sessions</h1>   
        ):(
            <>
                {sessions.current.map((session) => {
                    return(
                        <div onClick={()=> {nav("/instructor",  { state: { ID: session.ID } })}}className="session">
                            <h1>{session.NAME}</h1>
                            <br/>
                            <p>Session ID: {session.ID}</p>
                        </div>
                    )
                })}
                </>
            )
            
        }
        <Create/>
        </div>
    )
}