import React from "react";
import "../css/pp.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      {/* Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="logo">GPTEMS</div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/#features">Features</a>
            <a href="/#pricing">Pricing</a>
            <a href="mailto:tglewis247@gmail.com">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="privacy-content">
        <div className="container">
          <div className="privacy-header">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: December 2025</p>
          </div>

          <div className="privacy-body">
            <section className="privacy-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to GPTEMS ("we," "our," or "us"). We are committed to protecting your 
                personal information and your right to privacy. This Privacy Policy explains how 
                we collect, use, disclose, and safeguard your information when you visit our 
                website gptems.com and use our EMS training simulation platform.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of 
                this privacy policy, please do not access the site or use our services.
              </p>
            </section>

            <section className="privacy-section">
              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Personal Information You Provide</h3>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, password, phone numbers</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed by our payment processor)</li>
                <li><strong>Communication Data:</strong> Information you provide when contacting support or participating in surveys</li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li><strong>Usage Data:</strong> IP address, browser type, operating system, pages visited, time spent on pages</li>
                <li><strong>Training Data:</strong> Scenario completion times, intervention choices, assessment scores (anonymized for analytics)</li>
                <li><strong>Device Information:</strong> Device type, screen resolution, browser version</li>
                <li><strong>Cookies and Tracking Technologies:</strong> Local storage, authentication tokens, Cookies</li>
              </ul>

              <h3>2.3 Information from Third Parties</h3>
              <ul>
                <li>Information from educational institutions for enterprise accounts</li>
                <li>Payment information from our payment processors</li>
                <li>Analytics data from third-party services like Google Analytics</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>3. How We Use Your Information</h2>
              <ul>
                <li>To provide and maintain our EMS training platform</li>
                <li>To process your subscription and payment transactions</li>
                <li>To send you important updates, security alerts, and support messages</li>
                <li>To conduct research and analysis to improve our platform</li>
                <li>To comply with legal obligations and protect our legal rights</li>
                <li>To monitor platform usage and prevent fraudulent activity</li>
                <li>To provide customer support and respond to inquiries</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>4. Legal Basis for Processing (GDPR)</h2>
              <p>
                For users in the European Economic Area (EEA), we process your personal information 
                under the following legal bases:
              </p>
              <ul>
                <li><strong>Performance of Contract:</strong> To provide our services under our Terms of Service</li>
                <li><strong>Legitimate Interests:</strong> To improve our services, prevent fraud, and ensure security</li>
                <li><strong>Consent:</strong> Where you have given explicit consent for specific processing</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>5. Information Sharing and Disclosure</h2>
              
              <h3>5.1 We Do Not Sell Your Data</h3>
              <p>
                We do not sell, rent, or trade your personal information to third parties for 
                their commercial purposes.
              </p>

              <h3>5.2 Service Providers</h3>
              <p>We may share information with trusted service providers who assist us in:</p>
              <ul>
                <li>Payment processing (Stripe)</li>
                <li>Email and communication services</li>
                <li>Cloud hosting and infrastructure</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support platforms</li>
              </ul>

              <h3>5.3 Legal Requirements</h3>
              <p>We may disclose your information if required to do so by law or in response to:</p>
              <ul>
                <li>Valid legal processes (subpoenas, court orders)</li>
                <li>Government requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>To investigate potential violations of our Terms of Service</li>
              </ul>

              <h3>5.4 Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of all or a portion of our assets, 
                your information may be transferred as part of that transaction.
              </p>
            </section>

            <section className="privacy-section">
              <h2>6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to 
                protect the security of your personal information, including:
              </p>
              <ul>
                <li>Encryption of data in transit using TLS/SSL</li>
                <li>Secure storage of sensitive information</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security training for our team</li>
              </ul>
              <p>
                However, no electronic transmission over the internet or information storage 
                technology can be guaranteed to be 100% secure. We cannot guarantee the absolute 
                security of your information.
              </p>
            </section>

            <section className="privacy-section">
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the 
                purposes outlined in this Privacy Policy, unless a longer retention period is 
                required or permitted by law. Specifically:
              </p>
              <ul>
                <li><strong>Account Data:</strong> Retained while your account is active and for upto 30 days after closure</li>
                <li><strong>Payment Information:</strong> Retained as required by financial regulations (typically 7 years)</li>
                <li><strong>Training Analytics:</strong> Anonymized data may be retained indefinitely for research purposes</li>
                <li><strong>Communication Data:</strong> Retained for 3 years for customer service and legal purposes</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>8. Your Privacy Rights</h2>
              
              <h3>8.1 General Rights</h3>
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time</li>
              </ul>

              <h3>8.2 How to Exercise Your Rights</h3>
              <p>
                To exercise any of these rights, please contact us at tglewis247@gmail.com. We will 
                respond to your request within 30 days. We may need to verify your identity before 
                processing your request.
              </p>

              <h3>8.3 Do Not Track Signals</h3>
              <p>
                Our website does not respond to Do Not Track (DNT) signals. However, you can adjust 
                your browser settings to disable tracking technologies.
              </p>
            </section>

            <section className="privacy-section">
              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on computers located outside 
                of your state, province, country, or other governmental jurisdiction where the data 
                protection laws may differ from those of your jurisdiction.
              </p>
              <p>
                For transfers from the EEA to countries not deemed adequate by the European 
                Commission, we have put in place appropriate safeguards (such as Standard 
                Contractual Clauses) to protect your personal information.
              </p>
            </section>

            <section className="privacy-section">
              <h2>10. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not 
                knowingly collect personal information from children under 18. If you are a parent 
                or guardian and believe your child has provided us with personal information, 
                please contact us. If we become aware that we have collected personal information 
                from a child under 18, we will take steps to delete that information.
              </p>
            </section>

            <section className="privacy-section">
              <h2>11. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites, plugins, or applications. 
                Clicking on those links may allow third parties to collect or share data about you. 
                We do not control these third-party websites and are not responsible for their 
                privacy statements. We encourage you to read the privacy policy of every website 
                you visit.
              </p>
            </section>

            <section className="privacy-section">
              <h2>12. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform 
                and hold certain information. You can instruct your browser to refuse all cookies 
                or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                you may not be able to use some portions of our service.
              </p>
              
              <h3>Types of Cookies We Use:</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>13. California Privacy Rights (CCPA)</h2>
              <p>
                California residents have specific rights regarding their personal information 
                under the California Consumer Privacy Act (CCPA):
              </p>
              <ul>
                <li>The right to know what personal information is collected, used, shared, or sold</li>
                <li>The right to delete personal information collected from you</li>
                <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>The right to non-discrimination for exercising your CCPA rights</li>
              </ul>
              <p>
                To exercise your California privacy rights, please contact us at privacy@gptems.com.
              </p>
            </section>

            <section className="privacy-section">
              <h2>14. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last 
                Updated" date. You are advised to review this Privacy Policy periodically for any 
                changes.
              </p>
              <p>
                Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section className="privacy-section">
              <h2>15. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, 
                please contact us:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> tglewis247@gmail.com</p>
                <p><strong>Address:</strong> Aware LLC., Lacrosse WI</p>
                <p><strong>Phone:</strong> +1 (608) 886-0388</p>
              </div>
              <p>
                For data protection inquiries in the European Union, you may contact our 
                Data Protection Officer at: tglewis247@gmail.com
              </p>
            </section>

            <div className="privacy-footer">
              <p>
                By using our platform, you acknowledge that you have read and understood this 
                Privacy Policy and agree to be bound by its terms.
              </p>
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
              <a href="/tos">Terms of Service</a>
              <a href="mailto:tglewis247@gmail.com">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Aware LLC — All Rights Reserved. Not affiliated with OpenAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;