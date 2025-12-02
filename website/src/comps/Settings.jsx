import { useState, useRef } from "react";
import "../css/settings.css"
import {Auth} from "../firebase";
export default function Settings({Data}){
    const[deleting, setDeleting] = useState(false);
    const userData = useRef();
    
    userData.current = Data;
    const delacc = async() =>{

    }
    return(
        <>
            <div className="card" style={{ border: "2px solid #f44336" }}>
            <h3 style={{ color: "#f44336" }}>Danger Zone</h3>
            <p>Delete your account and all data permanently.</p>

            <button
              className="menu-btn delete"
              style={{ background: "#f44336", padding: 10 }}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        
        </>
    )
}