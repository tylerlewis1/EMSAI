import { useState } from "react";
import {auth} from "../firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase";
import {useNavigate} from "react-router-dom";
export default function Siginup() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const handleSignup = async(e) => {
        e.preventDefault();
        try{        
            createUserWithEmailAndPassword(auth, email, password) .then((userCredential) => {
                const userdocRef = doc(db, "users", auth.currentUser.uid)
                setDoc(userdocRef, {
                    Name: name,
                    Phone: phone,
                    Credits: 0,
                    Sessions: [],
                });
                console.log(auth.currentUser.uid);
                nav("/dash");
            });
        }catch(e){
            alert("There was a error");
            console.log(e.message);
        }
    
    }
    return (
    <section style={styles.container}>
      <h2 style={styles.title}>Create Your Account</h2>
      <p style={styles.subtitle}>Get started with GPTEMS today</p>

      <form style={styles.form} onSubmit={handleSignup}>
        <input
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
        />
        <input
          style={styles.input}
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          type="tel"
          placeholder="Phone Number"
        />
        <input
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
        />
        <input
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />

        <button style={styles.button} type="submit">
          Sign Up
        </button>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <a href="/signin" style={styles.link}>
            Log in
          </a>
        </p>
      </form>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "5rem auto",
    background: "#ffffff",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    backgroundColor: "#334155",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  footerText: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  link: {
    color: "#334155",
    textDecoration: "none",
    fontWeight: "600",
  },
};