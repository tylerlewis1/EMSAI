import { useEffect, useState } from "react";
import {auth, db} from "../firebase"
import { useNavigate } from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth"
import "../css/dash.css";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Sessions from "../comps/Sessions";
import Settings from "../comps/Settings";
export default function Dash(){
    const [userData, setUserData] = useState(null);
    const [screenState, setScreenState] = useState(1);
    const [menuOpen, setMenuOpen] = useState(false);
    const nav = useNavigate();
    useEffect(() =>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                nav("/");
            } else {
                getUserData(currentUser.uid);
            }
        });
        return () => unsubscribe();
    },[nav]);
   const getUserData = (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
      } else {
        console.log("No such document!");
      }
    }, (error) => {
      console.log("Error getting document:", error);
    });
    
    // Return unsubscribe function to clean up when component unmounts
    return unsubscribe;
    
  } catch(e) {
    console.log(e);
  }
}
    const handleLogout = () =>{
        auth.signOut();
    }
    return(
        <>
        {userData? (
           <div className="dash"> 
            <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
                <h3 className={"closeSideBar"}onClick={() => setMenuOpen(false)}>X</h3>
                <h2 className="logo" style={{color: "white"}}>GTPEMS</h2>
                <nav>
                <ul>
                    <li onClick={()=>{setScreenState(1)}} className={(screenState == 1)? ("active") : ("not")}>Dashboard</li>
                    {/* <li onClick={()=>{setScreenState(2)}} className={(screenState == 2)? ("active") : ("not")}>Saved Senarios</li> */}
                    <li onClick={()=>{setScreenState(3)}} className={(screenState == 3)? ("active") : ("not")}>Settings</li>
                    <a href="mailto:tglewis247@gmail.com"><li>Contact</li></a>
                </ul>
                </nav>
                <button className="logoutBtn" onClick={handleLogout}>
                Log out
                </button>
            </aside>
                 <div className="rightside">
                 <header className="dashHeader">
                    <button className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                    <div>
                        <h1>Hello, {userData.Name} 👋</h1>
                        <p>Welcome back to your GTPEMS dashboard</p>
                        <p>Credits: {userData.Credits}</p>
                    </div>
                </header>

                {/* This is where we will render dash comp */}
                
                <div className="content">
                    
                    {screenState === 1 && <Sessions Data={userData}/>}
                    {screenState === 3 && <Settings/>}
                </div>
             </div>
            </div>
    
    
    
    ) : (<></>)}
        
        </>
    );
}