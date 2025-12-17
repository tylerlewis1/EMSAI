import "../css/Hometemp.css"
import { useEffect, useState } from "react";
import {onSnapshot, addDoc, collection} from "firebase/firestore"
import {db, auth} from "../firebase"
import { useNavigate } from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import CheckSub from "../logic/checksub";
export default function Checkout(){
  const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    useEffect(() =>{
            const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                if (!currentUser) {
                    nav("/signin");
                } else {
                    const subData = await CheckSub();
                    console.log(subData);
                    if(subData.active && subData.status == "active"){
                      // nav("/dash");
                    }
                }
            });
            return () => unsubscribe();
      },[nav]);
    
    
    
    const createCheckoutSession = async (priceId, setLoader) => {
    try {
      if (!auth.currentUser) {
        alert("Please sign in first");
        return;
      }

      setLoader(true);

      const checkoutSessionRef = await addDoc(
        collection(
          db,
          "users",
          auth.currentUser.uid,
          "checkout_sessions"
        ),
        {
          price: priceId,
          success_url: window.location.origin + "/dash",
          cancel_url: window.location.origin + "/checkout",
          mode: "subscription"
        }
      );

      onSnapshot(checkoutSessionRef, (snap) => {
        const data = snap.data();
        console.log(snap.data());
        if (data?.url) {
          window.location.assign(data.url); // Stripe redirect
          setLoader(false);
        }
        if (data?.error) {
          console.error("Stripe error:", data.error.message);
          alert(data.error.message);
          setLoading(false);
        }
      });

    } catch (e) {
      setLoading(false);
      console.error(e);
      alert("Something went wrong.");
    } finally {
    }
  };
    return(
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
              <button disabled={loading} onClick={() => {createCheckoutSession("price_1SeoBxCwDOccAEUdrvxrdO9j", setLoading)}} className="btn btn-outline full-width">{!loading? ("Get Started") : ("Loading")}</button>
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
              <button disabled={loading} onClick={() => {createCheckoutSession("price_1SeoA3CwDOccAEUdjL1LgX9i", setLoading)}} className="btn btn-primary full-width">{!loading? ("Get Started") : ("Loading")}</button>
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
              <button disabled={loading} onClick={() => {createCheckoutSession("price_1Seo8YCwDOccAEUdT119hrtr", setLoading)}} className="btn btn-primary full-width">{!loading? ("Get Started") : ("Loading")}</button>
            
            </div>
             <div className="pricing-card pricing-card-featured">
              <div className="pricing-header">
                <h3>Pay As You Go</h3>
                <div className="price">
                  <span className="amount">$79</span>
                  <span className="period">/month</span>

                </div>
                <p className="price-description">Bring your own API key and just pay for what you use.</p>
                <div className="popular-badge">Best Value</div>
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
              <button disabled={loading} onClick={() => {createCheckoutSession("price_1Seo4uCwDOccAEUdx7yCPHqz", setLoading)}} className="btn btn-primary full-width">{!loading? ("Get Started") : ("Loading")}</button>
            
            </div>
          </div>
          
           <button onClick={() => {
              auth.signOut();
           }} className="btn btn-primary full-width">Logout</button>
        
        </div>
      </section>

    )
}
