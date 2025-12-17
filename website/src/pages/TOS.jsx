import React from "react";
import "../css/pp.css";

function TermsOfService() {
  return (
    <div className="terms-of-service">
      {/* Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="logo">GPTEMS</div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/#features">Features</a>
            <a href="/#pricing">Pricing</a>
            <a href="/privacypolicy">Privacy</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="terms-content">
        <div className="container">
          <div className="terms-header">
            <h1>Terms of Service</h1>
            <p className="last-updated">Last Updated: December 2, 2025</p>
            
            {/* Warning Banner */}
            <div className="warning-banner">
              ⚠️ IMPORTANT: This is a simulation tool only - NOT for real medical use
            </div>
          </div>

          <div className="terms-body">
            <div className="legal-notice">
              By accessing or using GPTEMS ("the Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part, you may not use the Service.
            </div>

            {/* Section 1 */}
            <section className="terms-section">
              <h2><span className="section-number">1</span> Agreement to Terms</h2>
              <p>
                By accessing or using GPTEMS ("the Service"), you agree to be bound by these Terms of Service. 
                If you disagree with any part, you may not use the Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="terms-section">
              <h2><span className="section-number">2</span> Service Description</h2>
              <p>
                GPTEMS is an AI-powered EMS training simulation tool designed for educational purposes only. It provides:
              </p>
              <ul>
                <li>Simulated patient scenarios using artificial intelligence</li>
                <li>Training exercises for medical professionals</li>
                <li>Educational content for skill development</li>
              </ul>
              
              <div className="critical-warning">
                <h3>Critical Understanding: This is a training tool, NOT:</h3>
                <ul>
                  <li>Real medical advice or diagnosis</li>
                  <li>A substitute for professional medical training</li>
                  <li>Intended for use in actual medical emergencies</li>
                  <li>A replacement for certified medical education</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="terms-section">
              <h2><span className="section-number">3</span> User Qualifications</h2>
              <p>You represent and warrant that:</p>
              <ul>
                <li>You are at least 18 years old</li>
                <li>You are a trained medical professional or student under supervision</li>
                <li>You understand this is simulation-only training</li>
                <li>You will verify all information with primary sources</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="terms-section">
              <h2><span className="section-number">4</span> No Medical Advice - Absolute Disclaimer</h2>
              <p>The Service provides fictional simulations only. AI-generated content:</p>
              <ul>
                <li>May contain errors, inaccuracies, or hallucinations</li>
                <li>Is not reviewed by medical professionals</li>
                <li>Should never be used for real patient care</li>
                <li>Must be verified with official medical resources</li>
              </ul>
              <div className="highlight-box">
                YOU ASSUME ALL RISK from using or applying any information from the Service.
              </div>
            </section>

            {/* Section 5 */}
            <section className="terms-section">
              <h2><span className="section-number">5</span> Limitation of Liability</h2>
              <p>To the maximum extent permitted by law:</p>
              
              <div className="subsection">
                <h3>5.1 No Liability for Medical Outcomes</h3>
                <p>GPTEMS, its owners, developers, and affiliates SHALL NOT BE LIABLE for:</p>
                <ul>
                  <li>Any medical decisions made by users</li>
                  <li>Real-world patient outcomes</li>
                  <li>Professional consequences (license issues, employment)</li>
                  <li>Injuries or deaths related to training application</li>
                </ul>
              </div>

              <div className="subsection">
                <h3>5.2 No Liability for Service Issues</h3>
                <p>We are not liable for:</p>
                <ul>
                  <li>Service interruptions or errors</li>
                  <li>Data loss or corruption</li>
                  <li>Inaccurate AI responses</li>
                  <li>Security breaches (though we implement reasonable security)</li>
                </ul>
              </div>

              <div className="subsection">
                <h3>5.3 Maximum Liability</h3>
                <p>
                  If we are found liable despite these disclaimers, our maximum liability shall be limited to $100 
                  or the amount you paid us in the last 12 months, whichever is less.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="terms-section">
              <h2><span className="section-number">6</span> Assumption of Risk</h2>
              <p>You expressly acknowledge and agree that:</p>
              <ul>
                <li>Medical simulation differs from real-world practice</li>
                <li>AI may generate incorrect or dangerous information</li>
                <li>Real patients may respond differently than simulations</li>
                <li>Professional supervision is required for real skill development</li>
              </ul>
              <div className="highlight-box">
                YOU ARE SOLELY RESPONSIBLE for verifying medical procedures
              </div>
            </section>

            {/* Section 7 */}
            <section className="terms-section">
              <h2><span className="section-number">7</span> Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless GPTEMS from any claims, damages, or expenses arising from:
              </p>
              <ul>
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your real-world medical decisions</li>
                <li>Any harm caused to third parties</li>
              </ul>
              <p>This includes our reasonable attorneys' fees.</p>
            </section>

            {/* Section 8 */}
            <section className="terms-section">
              <h2><span className="section-number">8</span> No Warranties</h2>
              <p>The Service is provided "AS IS" without warranties of any kind. We disclaim all warranties including:</p>
              <ul>
                <li>Fitness for any particular purpose</li>
                <li>Accuracy or reliability</li>
                <li>Error-free operation</li>
                <li>Compliance with medical standards</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="terms-section">
              <h2><span className="section-number">9</span> Mandatory Arbitration</h2>
              <p>Any disputes shall be resolved through binding arbitration in Wisconsin under AAA rules. You waive rights to:</p>
              <ul>
                <li>Class actions</li>
                <li>Jury trials</li>
                <li>Court proceedings (except small claims under $1,000)</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="terms-section">
              <h2><span className="section-number">10</span> Important Legal Rights You Waive</h2>
              <p>By using the Service, you understand you are WAIVING IMPORTANT LEGAL RIGHTS, including:</p>
              <ul>
                <li>Right to sue in court</li>
                <li>Right to a jury trial</li>
                <li>Right to participate in class actions</li>
                <li>Right to certain damages</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="terms-section">
              <h2><span className="section-number">11</span> User Responsibilities</h2>
              <p>You must:</p>
              <ul>
                <li>Use the Service only as a supplementary training tool</li>
                <li>Verify all information with certified sources</li>
                <li>Follow official medical protocols in real situations</li>
                <li>Maintain appropriate professional certifications</li>
                <li>Not use during actual emergencies</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section className="terms-section critical-section">
              <h2><span className="section-number">12</span> Medical Training Disclaimer</h2>
              <div className="critical-warning">
                <h3>WARNING: This simulation may:</h3>
                <ul>
                  <li>Provide medically inaccurate information</li>
                  <li>Suggest inappropriate treatments</li>
                  <li>Fail to simulate real patient responses</li>
                  <li>Create false confidence in skills</li>
                </ul>
              </div>
              <p>You must cross-reference ALL information with approved medical resources.</p>
            </section>

            {/* Section 13 */}
            <section className="terms-section">
              <h2><span className="section-number">13</span> Changes to Terms</h2>
              <p>We may modify these Terms at any time. Continued use constitutes acceptance of changes.</p>
            </section>

            {/* Section 14 */}
            <section className="terms-section">
              <h2><span className="section-number">14</span> Termination</h2>
              <p>We may suspend or terminate your access for any violation of these Terms.</p>
            </section>

            {/* Section 15 */}
            <section className="terms-section">
              <h2><span className="section-number">15</span> Governing Law</h2>
              <p>These Terms are governed by the laws of Wisconsin, without regard to conflict of law principles.</p>
            </section>

            {/* Section 16 */}
            <section className="terms-section">
              <h2><span className="section-number">16</span> Severability</h2>
              <p>If any provision is unenforceable, the rest remain valid.</p>
            </section>

            {/* Contact Section */}
            <div className="contact-box">
              <h2>Questions?</h2>
              <p>Contact us at:</p>
              <a href="mailto:Tglewis247@gmail.com" className="contact-link">
                Tglewis247@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">GPTEMS</div>
              <p>The future of emergency medical simulation training</p>
            </div>
            <div className="footer-links">
              <a href="/">Home</a>
              <a href="/#features">Features</a>
              <a href="/#pricing">Pricing</a>
              <a href="/privacypolicy">Privacy</a>
              <a href="mailto:tglewis247@gmail.com">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Aware LLC. All Rights Reserved.</p>
            <p>This document is for informational purposes and constitutes a legal agreement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TermsOfService;
