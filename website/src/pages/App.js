import { useState } from "react";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
function ComingSoon() {
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const nav = useNavigate();

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormMessage("");

    try {
      const response = await fetch("https://formspree.io/f/mjkjvvro", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          type: "waitlist",
          subject: "GPTEMS Waitlist Signup",
          _subject: "New Waitlist Signup - GPTEMS"
        })
      });

      if (response.ok) {
        setFormMessage("🎉 Success! You've been added to the waitlist. We'll notify you when we launch!");
        setIsWaitlisted(true);
        setEmail("");
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setFormMessage("❌ There was an error submitting the form. Please try again.");
      console.error('Waitlist submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(inviteCode == "medic26"){
      console.log(inviteCode);
      nav("/signup");
    }else{
      alert("invalid code");
    }
    
    setIsLoading(false);
    
  };

  return (
    <div className="coming-soon-app">
      {/* Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="logo">GPTEMS</div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button 
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="btn-login"
            >
              {showInviteForm ? "Join Waitlist" : "Have an Invite?"}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="coming-soon-main">
        <div className="container">
          {/* Hero Section */}
          <section className="coming-soon-hero">
            <div className="hero-content">
              <div className="badge">Coming Soon</div>
              <h1 className="hero-title">
                Revolutionizing <span className="gradient-text">EMS Training</span> with AI
              </h1>
              <p className="hero-description">
                Real-time AI patients that talk, react, and respond to interventions. 
                Join the waitlist for early access to the future of emergency medical simulation.
              </p>

              {/* Form Message */}
              {formMessage && (
                <div className={`form-message ${formMessage.includes("❌") ? "error" : "success"}`}>
                  {formMessage}
                </div>
              )}

              {/* Invite Code Form */}
              {showInviteForm ? (
                <div className="invite-section">
                  <h3>Already have an invite code?</h3>
                  <form onSubmit={handleInviteSubmit} className="invite-form">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Enter your invite code (e.g., GPTEMS123)"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        required
                        className="form-input"
                      />
                      <button type="submit" className="cta-primary" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Access Platform"}
                      </button>
                    </div>
                  </form>
                  <p className="switch-form">
                    Don't have an invite?{" "}
                    <button onClick={() => setShowInviteForm(false)} className="text-link">
                      Join the waitlist
                    </button>
                  </p>
                </div>
              ) : (
                /* Waitlist Form */
                <div className="waitlist-section">
                  {!isWaitlisted ? (
                    <>
                      <form onSubmit={handleWaitlistSubmit} className="waitlist-form">
                        <div className="input-group">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                          />
                          <button type="submit" className="cta-primary" disabled={isLoading}>
                            {isLoading ? "Joining..." : "Join Waitlist"}
                          </button>
                        </div>
                        <p className="form-note">
                          Be among the first to experience GPTEMS
                        </p>
                      </form>
                      <p className="switch-form">
                        Already have an invite code?{" "}
                        <button onClick={() => setShowInviteForm(true)} className="text-link">
                          Access platform
                        </button>
                      </p>
                    </>
                  ) : (
                    /* Success State */
                    <div className="success-message">
                      <div className="success-icon">🎉</div>
                      <h3>You're on the list!</h3>
                      <p>
                        Thank you for joining the GPTEMS waitlist. We'll notify you when 
                        early access becomes available. In the meantime, check out our features below.
                      </p>
                      <button 
                        onClick={() => {
                          setIsWaitlisted(false);
                          setFormMessage("");
                        }}
                        className="cta-secondary"
                      >
                        Add Another Email
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="waitlist-stats">
                <div className="stat">
                  <div className="stat-number">1,247+</div>
                  <div className="stat-label">EMS Professionals</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Training Institutions</div>
                </div>
                <div className="stat">
                  <div className="stat-number">Late 2025</div>
                  <div className="stat-label">Expected Launch</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual">
              <img 
                src="https://i.ibb.co/8n3bsP8B/crew.png" 
                alt="Crew Vitals Monitor" 
                className="hero-image"
              />
            </div>
          </section>

          {/* Features Preview */}
          <section id="features" className="coming-soon-features">
            <h2 className="section-title">What to Expect</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎙️</div>
                <h3>Real-time AI Voice</h3>
                <p>Natural conversations with AI patients that respond to your interventions in real-time</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Dynamic Vitals</h3>
                <p>Realistic patient vitals that change based on treatment and condition progression</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👨‍🏫</div>
                <h3>Instructor Controls</h3>
                <p>Full control over scenarios, patient behavior, and intervention outcomes</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3>Browser-based</h3>
                <p>No downloads required - access everything through your web browser</p>
              </div>
            </div>
          </section>

          {/* Dashboard Preview */}
          <section className="dashboard-preview">
            <div className="preview-content">
              <h2>Experience the Future of EMS Training</h2>
              <p>See how GPTEMS transforms simulation training with AI-powered patients</p>
              <img 
                src="https://i.ibb.co/qLGj6dYF/instructor.png" 
                alt="Instructor Dashboard Preview" 
                className="dashboard-preview-image"
              />
            </div>
          </section>

          {/* Final CTA */}
          <section className="final-cta">
            <div className="cta-content">
              <h2>Ready to Transform Your Training?</h2>
              <p>Join the waitlist and be the first to revolutionize your EMS simulation program</p>
              {!isWaitlisted && !showInviteForm && (
                <button 
                  onClick={() => document.querySelector('.waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="cta-primary large"
                >
                  Join Waitlist Now
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">GPTEMS</div>
              <p>Revolutionizing EMS training through AI simulation</p>
            </div>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 GPTEMS — All Rights Reserved. Not affiliated with OpenAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ComingSoon;