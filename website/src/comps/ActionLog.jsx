import { onSnapshot, doc } from "firebase/firestore"
import { useState, useEffect } from "react";
import {db} from "../firebase";
import { useNavigate } from "react-router-dom";
export default function ActionLog({sessionID, actions}){
    const [logData, setLogData] = useState();
    const [timeActive, setTimeActive] = useState(null);
    const nav = useNavigate();
    useEffect(() => {
        if(logData && logData.active && timeActive == null) {
            setTimeActive((((new Date() - logData.start?.toDate())/1000)/60).toFixed(0).toString() + " Mins");
            const intervalId = setInterval(() =>{
                setTimeActive((((new Date() - logData.start?.toDate())/1000)/60).toFixed(0).toString() + " Mins");
            }, 5000);
        }
     });
    useEffect(() =>{
        async function getDoc() {
            const docRef = doc(db, "sessions", sessionID.sessionId)
            onSnapshot(docRef, (snap) =>{
                if(!snap.exists()){
                   nav("/dash"); 
                }
                setLogData(snap.data());
                return(snap.data());
            })
        }
        getDoc();

    }, [])
    return(
        <>
            <div className="actionLog">
            {!logData?.start? (
                <>
                    <h2>Session <a style={{color: "red"}}>Inactive</a></h2>
                </>
            ):(
                <>
                <h2>Session <a style={{color: "green"}}>Active</a></h2>
                <h3>Time active: {timeActive}</h3>
                <div className="actions">
                    <div className="action">
                        <h5>Start time: {logData.start.toDate().toLocaleTimeString()}</h5>
                    </div>
                    {logData.actionlog?.map((item) =>{
                        return(
                        <div className="action">
                            <h6>{item.time.toDate().toLocaleTimeString()}</h6>
                            <h5>{item.name}</h5>
                        </div>                  
                        )
                    })}
                </div>
                </>
            )}
            </div>
        </>
    )
}
