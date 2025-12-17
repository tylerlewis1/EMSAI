import { useState, useRef, useEffect } from "react";
import "../css/settings.css"
import {auth, db} from "../firebase";
import { useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth";
import {doc, writeBatch, updateDoc } from "firebase/firestore";
import Crypto from 'crypto-js';
import CheckSub from "../logic/checksub";
export default function Settings({Data}){
    const[deleting, setDeleting] = useState(false);
    const nav = useNavigate();
    const userData = useRef();
    const [key, setKey] = useState("");
    const [subData, setSubData] = useState(null);
    useEffect(() => {
      const getSub = async() =>{
        await CheckSub().then((result) => {
          setSubData(result);
          return;
        });
        
      }
      getSub();
    }, []);
    userData.current = Data;
    const delacc = async() =>{
      let pass = prompt(`Enter your password to deleate you account`);
      if(pass == null || ""){
        return;
      }
      try{
         await signInWithEmailAndPassword(auth, auth.currentUser.email, pass).then((user) =>{
          setDeleting(true);
          try{
            const batch = writeBatch(db);
            const userDoc = doc(db, "users", auth.currentUser.uid);
            batch.delete(userDoc);
            batch.commit();
            auth.currentUser.delete();
            // cons
           }catch(e){
             alert("There was a error removing your account. Contact the admin at Tglewis247@gmail.com.");
             setDeleting(false);
           }
          });
      } catch(error){
        if(error.code == "auth/invalid-credential"){
          alert("Invalid username or password");
          return;
        }
        console.log(error);
      }
    }

    const saveKey = async() =>{
      try{
        var encrypted = await Crypto.AES.encrypt(key, auth.currentUser.uid);
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          key: encrypted.toString()
        });
        alert("uploaded");
      }catch(e){
        console.log(e);
      }
    }
    return(
        <div className="settings">
            <div className="card" style={{ border: "2px solid green" }}>
              <h3 style={{ color: "#1e293b" }}>Settings</h3>
              {!(subData?.level == "BYOK")? (null) : (
                <div style={{padding: "20px"}}>
                  <p>Add your API key</p>
                  <input className="input" style={{height: "10px", marginBottom: "10px"}} onChange={(e) => setKey(e.target.value)} value={key} type="password"/>
                  <button
                    className="menu-btn"
                    onClick={() => saveKey()}
                    style={{ background: "green", padding: 10 }}
                  >
                    Encrypt and Save
                  </button>
                </div>
                )}
              <div style={{padding: "20px"}}>  
                <p>Manage your plan and billing.</p>
                <button
                    className="menu-btn"
                    onClick={() => window.location.replace("https://billing.stripe.com/p/login/dRm4gy34CgzFcaW3Zf6c000")}
                    style={{ background: "green", padding: 10 }}
                  >
                    Billing Portal
                  </button>
              </div>

            </div>
            <div className="card" style={{ border: "2px solid #f44336" }}>
            <h3 style={{ color: "#f44336" }}>Danger Zone</h3>
            <p>Delete your account and all data permanently.</p>
            <button
              className="menu-btn"
              style={{ background: "#f44336", padding: 10 }}
              disabled={deleting}
              onClick={delacc}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        
        </div>
    )
}
