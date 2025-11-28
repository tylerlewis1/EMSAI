import { useEffect, useState } from "react";
import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";
export default function Signin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const nav = useNavigate();
  useEffect(() => {
    if(auth.currentUser != null){
       nav("/dash");
    }
  }, [auth]);

  const forgotPass = async () => {
    if(!email){
      alert("fill in your email first");
      return;
    }
    sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("email sent")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("error contact tglewis247@gmail.com");
    });
  }  
  const handleSignin = async (e) => { 
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password).then((user) =>{
                nav("/dash");
            });
        } catch(error) {
            alert("there was a error");
            console.log(error);
        }
    }
    
    return (
    <section style={styles.container}>
      <h2 style={styles.title}>Welcome Back 👋</h2>
      <p style={styles.subtitle}>Log in to access your GPTEMS dashboard</p>

      <form style={styles.form} onSubmit={handleSignin}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email Address"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Sign In
        </button>

        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <a href="/signup" style={styles.link}>
            Create one
          </a>
        </p>

        <p style={styles.altText}>
          <a onClick={() => forgotPass()} style={styles.link}>
            Forgot password?
          </a>
        </p>
      </form>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "6rem auto",
    background: "#ffffff",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
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
    backgroundColor: "#1e293b",
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
  altText: {
    marginTop: "0.5rem",
    fontSize: "0.85rem",
  },
  link: {
    color: "#253248ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};
