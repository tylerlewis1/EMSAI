import "../css/Hometemp.css";
import { useState } from "react";
function Home() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="modern-app">
      {/* Animated Header with Glassmorphism */}
      <header className="modern-header">
        <div className="header-container">
          <div className="logo">
            <img style={{width: "150px", left: "50px", position: "absolute"}} className="logo-icon" src="./logo.png"/>
          </div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#demo" className="nav-link">Demo</a>
            <a href="/signin" className="btn btn-login">
              <span className="btn-icon">👤</span>
              Sign In
            </a>
          </nav>
          <button className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Hero Section with Particle Background */}
      <section className="modern-hero">
        <div className="hero-background">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">⚡</span>
              Next-Gen EMS Training
            </div>
            <h1 className="hero-title">
              <span className="title-line">Train with</span>
              <span className="title-gradient">AI-Powered</span>
              <span className="title-line">Real Patients</span>
            </h1>
            <p className="hero-description">
              Experience hyper-realistic EMS simulations with AI patients that breathe, speak, 
              and respond dynamically to every intervention—all in your browser.
            </p>
            <div className="hero-actions">
              <a href="/signup" className="btn btn-primary">
                <span className="btn-icon">🚀</span>
                Start Now
                <span className="btn-arrow">→</span>
              </a>
              <a href="#demo" className="btn btn-secondary">
                <span className="btn-icon">🎬</span>
                Watch Demo
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Institutions</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">98.7%</div>
                <div className="stat-label">Realism Rating</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">AI Support</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-container">
              <img 
                src="https://i.ibb.co/8n3bsP8B/crew.png" 
                alt="AI Patient Interface" 
                className="hero-image"
              />
              <div className="visual-overlay">
                <div className="overlay-card">
                  <div className="overlay-icon">🎙️</div>
                  <div className="overlay-text">"I'm having chest pain..."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works - Timeline Style */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">How It Works</div>
            <h2 className="section-title">Transform Training in 4 Steps</h2>
            <p className="section-subtitle">From setup to simulation in minutes</p>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <div className="timeline-icon">🎯</div>
                <h3>Create Scenario</h3>
                <p>Select patient demographics, medical history, presenting complaint, and voice personality.</p>
                <ul className="timeline-features">
                  <li>Custom vitals & symptoms</li>
                  <li>Multiple voice options</li>
                  <li>Pre-built templates</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <div className="timeline-icon">👨‍🏫</div>
                <h3>Instructor Controls</h3>
                <p>Monitor and manipulate the scenario in real-time from your dashboard.</p>
                <ul className="timeline-features">
                  <li>Live vitals adjustment</li>
                  <li>Behavior overrides</li>
                  <li>Intervention tracking</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <div className="timeline-icon">💬</div>
                <h3>Crew Interaction</h3>
                <p>Your team converses with the AI patient using natural language and push-to-talk.</p>
                <ul className="timeline-features">
                  <li>Real-time voice responses</li>
                  <li>Dynamic condition changes</li>
                  <li>Log all crew actions</li>
                </ul>
              </div>
            </div>

             <div className="timeline-item">
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <div className="timeline-icon">📄</div>
                <h3>Performance Report</h3>
                <p>Get realtime feedback on the call in a PDF.</p>
                <ul className="timeline-features">
                  <li>Dispatch Information</li>
                  <li>Event log</li>
                  <li>AI analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Icons */}
      <section id="features" className="features-grid-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2 className="section-title">Everything You Need for Realistic Simulation</h2>
            <p className="section-subtitle">Powered by cutting-edge AI technology</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card feature-card">
              <div className="feature-icon">🎙️</div>
              <h3>Real-time Voice AI</h3>
              <p>Natural conversations with emotional intelligence and medical accuracy</p>
              <div className="feature-tags">
                <span className="tag">Emotional</span>
                <span className="tag">Accurate</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Dynamic Updates</h3>
              <p>Real-time monitoring that responds to interventions and medications</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart Memory</h3>
              <p>Patients remember history, medications, and previous interactions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Setup</h3>
              <p>Launch realistic simulations in under 2 minutes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Team Training</h3>
              <p>Multiple crew members can interact simultaneously with roles</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Dashboard</h3>
              <p>Track all senarios in use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Preview */}
      <section id="demo" className="demo-preview">
        <div className="container">
          <div className="demo-container">
            <div className="demo-content">
              <h2>See the Future of EMS Training</h2>
              <p>Watch how AI transforms traditional simulation methods with real-time interaction and dynamic responses.</p>
              <div className="demo-highlights">
                <div className="highlight">
                  <div className="highlight-icon">✅</div>
                  <span>No downloads required</span>
                </div>
                <div className="highlight">
                  <div className="highlight-icon">✅</div>
                  <span>Works on any device</span>
                </div>
                <div className="highlight">
                  <div className="highlight-icon">✅</div>
                  <span>Real-time collaboration</span>
                </div>
              </div>
              <a href="mailto:tglewis247@gmail.com" className="btn btn-outline">
                <span className="btn-icon">📞</span>
                Schedule a Live Demo
              </a>
            </div>
            <div className="demo-visual">
              <div className="demo-window">
                <div className="window-header">
                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
               {(!playing) ? (
                <>
                <img 
                  src="https://i.ibb.co/qLGj6dYF/instructor.png" 
                  alt="Live Demo Preview" 
                  className="demo-image"
                />
                <div onClick={() => setPlaying(true)} className="demo-play-btn">
                  <span className="play-icon">▶</span>
                </div>
                </>
               ):(
                  <iframe width="100%" height="350px" src="https://www.youtube.com/embed/_mrms_0r6a8?si=W69MmUtEuRq3yj86" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
               )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Pricing</div>
            <h2 className="section-title">Simple Plans for Every Team</h2>
            <p className="section-subtitle">Start small, upgrade as you grow</p>
          </div>
          
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="price">
                  <span className="amount">$49</span>
                  <span className="period">/month</span>
                </div>
                <p className="price-description">Perfect for small to medium departments</p>
              </div>
              <div className="pricing-features">
                <div className="feature">
                  <span className="check">✓</span>
                  <span>8 Scenarios/month</span>
                </div>
                <div className="feature">
                  <span className="check">✓</span>
                  <span>8 AI voices</span>
                </div>
              </div>
              <a href="/signup" className="btn btn-outline full-width">Start Now</a>
            </div>
            
            <div className="pricing-card pricing-card-featured">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <div className="price">
                  <span className="amount">$119</span>
                  <span className="period">/month</span>
                </div>
                <p className="price-description">For small to medium institutions</p>
              </div>
              <div className="pricing-features">
                <div className="feature">
                  <span className="check">✓</span>
                  <span>20 Scenarios/month</span>
                </div>
                <div className="feature">
                  <span className="check">✓</span>
                  <span>Rapid Support</span>
                </div>
              </div>
              <a href="/signup" className="btn btn-primary full-width">Get Started</a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">
                  <span className="amount">$249</span>
                  <span className="period">/month</span>
                </div>
                <p className="price-description">For large organizations</p>
              </div>
              <div className="pricing-features">
                <div className="feature">
                  <span className="check">✓</span>
                  <span>50 Scenarios/month</span>
                </div>
                <div className="feature">
                  <span className="check">✓</span>
                  <span>Everything in Pro</span>
                </div>
                <div className="feature">
                  <span className="check">✓</span>
                  <span>Training & onboarding</span>
                </div>
              </div>
              <a href="/signup" className="btn btn-primary full-width">Get Started</a>
            </div>
           <div className="pricing-card pricing-card-featured">
            <div className="popular-badge">Best Value</div>
              <div className="pricing-header">
                <h3>Pay As You Go</h3>
                <div className="price">
                  <span className="amount">$79</span>
                  <span className="period">/month</span>

                </div>
                <p className="price-description">Bring your own API key and just pay for what you use.</p>
              </div>
              <div className="pricing-features">
                <div className="feature">
                  <span className="check">✓</span>
                  <span>Unlimited Scenarios/month</span>
                </div>
                <div className="feature">
                  <span className="check">✓</span>
                  <span>Everything in Enterprise</span>
                </div>

                <div className="feature">
                  <span className="check">✓</span>
                  <span>Training & onboarding</span>
                </div>

                 <div className="feature">
                  <span className="check">✓</span>
                  <span>Setup Assistance</span>
                </div>
              </div>
              <a href="/signup" className="btn btn-primary full-width">Get Started</a>
            </div>
          </div>
        
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Transform Your Training?</h2>
              <p>Join thousands of EMS professionals already using AI-powered simulation</p>
              <div className="cta-actions">
                <a href="/signup" className="btn btn-primary btn-large">
                  <span className="btn-icon">🚀</span>
                  Start Now
                </a>
                <a href="#demo" className="btn btn-secondary btn-large">
                  <span className="btn-icon">🎬</span>
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="cta-stats">
              <div className="stat">
                <div className="stat-number">Rapid</div>
                <div className="stat-label">Support</div>
              </div>
              <div className="stat">
                <div className="stat-number">5-min</div>
                <div className="stat-label">Setup</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">🚑</span>
                <span className="logo-text">GPTEMS</span>
              </div>
              <p className="footer-tagline">The future of emergency medical simulation</p>
              <div className="social-links">
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🎥</a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#demo">Demo</a>
                <a href="#pricing">Pricing</a>
                <a href="/updates">Updates</a>
              </div>
              
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="/docs">Documentation</a>
                <a href="/guides">Guides</a>
                <a href="/blog">Blog</a>
                <a href="/community">Community</a>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <a href="/about">About</a>
                {/* <a href="/careers">Careers</a> */}
                <a href="mailto:tglewis247@gmail.com">Contact</a>
                <a href="/privacy">Privacy</a>
              </div>
              
              <div className="footer-column">
                <h4>Contact</h4>
                <p className="contact-info">tglewis247@gmail.com</p>
                <p className="contact-info">+1 (608) 886-0388</p>
                <p className="contact-info">La Crosse, WI</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>2025 GPTEMS. Owned and operated by Aware LLC. Not affiliated with OpenAI.</p>
            <div className="footer-legal">
              <a href="/tos">Terms</a>
              <a href="/privacy">Privacy</a>
              {/* <a href="/cookies">Cookies</a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
