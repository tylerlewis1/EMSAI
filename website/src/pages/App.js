import "../css/home.css";
function App() {
  return (
    <div>
  <header class="navbar">
    <div class="logo">GPTEMS</div>
    <nav class="nav-links">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#demo">Demo</a>
      <a href="/signin" class="btn">Login</a>
    </nav>
  </header>

  <section class="hero">
    <h1>The Future of EMS Training</h1>
    <p>
      Real-time AI patients that talk, react, panic, improve, and respond to interventions—
      all inside your browser.
    </p>
    <a href="/signup" class="cta">Get Started</a>
  </section>

  <section class="how">
    <h2>How It Works</h2>

    <div class="how-grid">
      <div class="how-card">
        <h3>1. Create a Scenario</h3>
        <p>Choose complaint, age, medical history, behavior, and voice.</p>
      </div>

      <div class="how-card">
        <h3>2. Instructor Controls</h3>
        <p>Push vitals, override behavior, and administer interventions.</p>
      </div>

      <div class="how-card">
        <h3>3. Crew Interacts</h3>
        <p>Realistic voice conversations with dynamic AI patient responses.</p>
      </div>
    </div>
  </section>

  <section id="features" class="features">
    <h2>Features</h2>

    <div class="features-grid">
      <div class="feature">Real-time AI patient voice</div>
      <div class="feature">Dynamic vitals</div>
      <div class="feature">Intervention-aware responses</div>
      <div class="feature">Instructor dashboard</div>
      <div class="feature">Behavior overrides</div>
      <div class="feature">Scenario history</div>
      <div class="feature">Multiple patient voices</div>
      <div class="feature">Push-to-Talk</div>
      <div class="feature">Browser-based</div>
    </div>
  </section>

  <section id="pricing" class="pricing">
    <h2>Pricing</h2>

    <div class="pricing-grid">
      <div class="pricing-card">
        <h3>Starter</h3>
        <p class="price">$19<span>/mo</span></p>
        <ul>
          <li>20 scenarios / month</li>
          <li>1 instructor</li>
          <li>Basic AI patient</li>
        </ul>
        <a class="btn" href="/signup">Start</a>
      </div>

      <div class="pricing-card highlight">
        <h3>Pro</h3>
        <p class="price">$49<span>/mo</span></p>
        <ul>
          <li>Unlimited scenarios</li>
          <li>Advanced interventions</li>
          <li>Faster AI</li>
          <li>Instructor tools</li>
        </ul>
        <a class="btn" href="/signup">Start Pro</a>
      </div>

      <div class="pricing-card">
        <h3>Classroom</h3>
        <p class="price">$149<span>/mo</span></p>
        <ul>
          <li>Unlimited instructors</li>
          <li>Unlimited crews</li>
          <li>Scenario sharing</li>
          <li>Analytics</li>
        </ul>
        <a class="btn" href="/contact">Contact Sales</a>
      </div>
    </div>
  </section>

  <section id="demo" class="cta-section">
    <h2>Ready to Train Smarter?</h2>
    <p>Create hyper-realistic EMS simulations in seconds.</p>
    <a href="/signup" class="cta">Start Free Trial</a>
  </section>

  <footer class="footer">
    © 2025 GPTEMS — All Rights Reserved not affilated with open AI
  </footer>
</div>

  );
}

export default App;
