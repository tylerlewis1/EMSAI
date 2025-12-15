import { useEffect, useRef, useState } from "react"
import { data, useSearchParams } from "react-router-dom";
import Create from "../comps/CreateModal";
import "../css/sessions.css";
import { FaNotesMedical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CheckSub from "../logic/checksub";
export default function Sessions({Data}){
    const nav = useNavigate();
    const sessions = useRef();
    const credits = useRef();
    const [subData, setSubData] = useState();
    credits.current = Data.Credits;
    sessions.current = Data.Sessions;
     useEffect(() => {
        const getSub = async() =>{
            await CheckSub().then((result) => {
                setSubData(result);
                return;
            });   
        }
        getSub();
    }, []);
    return(
        <div className="session-list">
        {!(sessions.current.length > 0) ? (
            <>
            <FaNotesMedical size={"5%"} style={{display: "block", margin: "auto", paddingBottom: "20px"}}/>
            <h2 style={{textAlign: "center", padding: 50}}>No active sessions</h2>   
            </>
        ):(
            <>
                {sessions.current.map((session) => {
                    return(
                        <div className="session">
                            <h1>{session.NAME}</h1>
                            <br/>
                            <p>Session ID: {session.ID}</p>
                            <p>Crew link: https://gptems.com/crew</p>
                            <button 
                            onClick={()=> {nav("/instructor",  { state: { ID: session.ID } })}}
                            style={{
                                width: "50%",
                                backgroundColor: "#1e293b",
                                borderRadius: "20px",
                                color: "white",
                                padding: "5px",
                                margin: "10px"
                            }}
                            className="insbtn"
                            >Go to instructor dashboard</button>
                        </div>
                    )
                })}
                </>
            )
            
        }
        {(credits.current > 0 && (subData?.level !="BYOK" || (subData?.level == "BYOK" && Data?.key != null))) ? (
            <Create/>
        ): (
            <a href="mailto:tglewis247@gmail.com"><button style={{backgroundColor: "red", color: "white", width: "100%"}} className="btn">You're out of tokns or havent added your key yet! Email us at tglewis247@gmail.com or go to settings and add your key!</button></a>
        )}
        
        </div>
    )
}