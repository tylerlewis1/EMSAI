import "../css/Hometemp.css";

function Home() {
  return (
    <div className="modern-app">
      {/* Modern Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="logo">GPTEMS</div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#demo">Demo</a>
            <a href="/signin" style={{color: "white"}}className="btn-login">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="modern-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              The Future of <span className="gradient-text">EMS Training</span>
            </h1>
            <p className="hero-description">
              Real-time AI patients that talk, react, panic, improve, and respond to interventions—
              all inside your browser.
            </p>
            <div className="hero-actions">
              <a href="/signup" className="cta-primary">Get Started Free</a>
              <a href="#demo" className="cta-secondary">Watch Demo</a>
            </div>
          </div>
          <div className="hero-visual">
            <img 
              src="https://i.ibb.co/8n3bsP8B/crew.png" 
              alt="Crew Vitals Monitor" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="modern-how">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="card-number">1</div>
              <h3>Create a Scenario</h3>
              <p>Choose complaint, age, medical history, behavior, and voice.</p>
            </div>
            <div className="how-card">
              <div className="card-number">2</div>
              <h3>Instructor Controls</h3>
              <p>Push vitals, override behavior, and administer interventions.</p>
            </div>
            <div className="how-card">
              <div className="card-number">3</div>
              <h3>Crew Interacts</h3>
              <p>Realistic voice conversations with dynamic AI patient responses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Dashboard Preview */}
      <section id="features" className="modern-features">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Powerful Features</h2>
            <p>Everything you need for realistic EMS simulation training</p>
          </div>
          
          <div className="features-showcase">
            <div className="features-list">
              <div className="feature-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎙️</div>
                  <span>Real-time AI patient voice</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <span>Dynamic vitals</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💬</div>
                  <span>Intervention-aware responses</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👨‍🏫</div>
                  <span>Instructor dashboard</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <span>Behavior overrides</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔊</div>
                  <span>Multiple patient voices</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎤</div>
                  <span>Push-to-Talk</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌐</div>
                  <span>Browser-based</span>
                </div>
              </div>
            </div>
            <div className="features-preview">
              <img 
                src="https://i.ibb.co/qLGj6dYF/instructor.png" 
                alt="Scenario Manager Dashboard" 
                className="dashboard-image"
              />
              
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="modern-pricing">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="card-header">
                <h3>Starter</h3>
                <p className="price">$49<span>/mo</span></p>
              </div>
              <ul className="features-list">
                <li>✓ 20 scenarios / month</li>
              </ul>
              <a className="btn-pricing" href="/signup">Start Free Trial</a>
            </div>

            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="card-header">
                <h3>Pro</h3>
                <p className="price">$119<span>/mo</span></p>
              </div>
              <ul className="features-list">
                <li>✓ 50 scenarios / month</li>
              </ul>
              <a className="btn-pricing featured" href="/signup">Start Pro Trial</a>
            </div>

            <div className="pricing-card">
              <div className="card-header">
                <h3>Classroom</h3>
                <p className="price">$249<span>/mo</span></p>
              </div>
              <ul className="features-list">
                <li>✓ Unlimited scenarios</li>
                <li>✓ Professional software training</li>
              </ul>
              <a className="btn-pricing" href="/contact">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="demo" className="modern-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform EMS Training?</h2>
            <p>Join thousands of instructors creating hyper-realistic simulations</p>
            <div className="cta-actions">
              <a href="/signup" className="cta-primary large">Start Free Trial</a>
              <a href="#features" className="cta-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">GPTEMS</div>
              <p>The future of emergency medical simulation training</p>
            </div>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
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

export default Home;