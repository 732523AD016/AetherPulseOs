import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [heartRate, setHeartRate] = useState(78);

  // Live heart rate simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => Math.floor(75 + Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="app">
      {/* ALERT BANNER */}
      <div class="ab">
        ⚠ CRITICAL — PATIENT HR ELEVATED — QUANTUM ROUTE ACTIVE — APOLLO HOSPITAL — ETA 4 MIN
      </div>

      {/* NAVIGATION */}
      <nav>
        <div className="logo" onClick={() => setActiveTab('landing')}>
          AETHERPULSE OS
        </div>
        <div className="nav-tabs">
          {['dashboard', 'sos', 'voice', 'wellness', 'hospital', 'admin'].map((tab) => (
            <button
              key={tab}
              className={`ntab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <div className="hr-display">
            ♥ <span>{heartRate}</span> <span style={{ fontSize: '10px' }}>bpm</span>
          </div>
          <button className="btn btn-solid" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => setActiveTab('sos')}>
            SOS
          </button>
        </div>
      </nav>

      {/* LANDING PAGE */}
      {activeTab === 'landing' && (
        <div className="page hero">
          <div style={{ fontFamily: 'Orbitron', fontSize: '11px', letterSpacing: '5px', color: 'var(--cyan)', marginBottom: '16px', opacity: 0.8 }}>
            URBAN AI HEALTHCARE SYSTEM
          </div>
          <h1 className="hero-title">AetherPulse OS</h1>
          <p className="hero-sub">
            We are not just building an app — we are saving the next 100 lives in your city. AI-powered emergency response that finds hospital beds before they are officially empty.
          </p>
          <div className="hero-btns">
            <button className="btn btn-solid" onClick={() => setActiveTab('dashboard')}>GET STARTED</button>
            <button className="btn btn-cyan" onClick={() => setActiveTab('dashboard')}>LIVE DEMO</button>
          </div>

          <div style={{ marginTop: '60px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '18px', color: 'var(--text)' }}>PLATFORM FEATURES</h2>
              <p style={{ color: 'var(--dim)', fontSize: '13px', marginTop: '6px' }}>Startup-grade technology built for real emergency impact</p>
            </div>
            
            <div className="feature-grid">
              <div className="gc">
                <div className="feature-icon">🚨</div>
                <div className="feature-title">ONE-TAP SOS</div>
                <div className="feature-desc">Instantly dispatches ambulance with GPS location and notifies emergency contacts automatically</div>
              </div>
              <div className="gc">
                <div className="feature-icon">🧠</div>
                <div className="feature-title">NEURAL AI ROUTING</div>
                <div className="feature-desc">Scores hospitals by distance, traffic, ICU beds, specialty — selects optimal rescue node in milliseconds</div>
              </div>
              <div className="gc">
                <div className="feature-icon">🗺️</div>
                <div className="feature-title">QUANTUM ROUTING</div>
                <div className="feature-desc">Live ambulance tracking with obstacle-aware rerouting via Google Maps integration</div>
              </div>
              <div className="gc">
                <div className="feature-icon">🎙️</div>
                <div className="feature-title">VOICE AI ASSISTANT</div>
                <div className="feature-desc">Tamil, Hindi, English voice commands for rural accessibility and emergency guidance</div>
              </div>
              <div className="gc">
                <div className="feature-icon">💚</div>
                <div className="feature-title">WELLNESS SYNC</div>
                <div className="feature-desc">Real-time HR, SpO2, steps and sleep tracking with AI health insights and anomaly detection</div>
              </div>
              <div className="gc">
                <div className="feature-icon">🏥</div>
                <div className="feature-title">HOSPITAL NETWORK</div>
                <div className="feature-desc">Live ICU bed, ER, and ambulance data across 6 hospitals updated every 30 seconds</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTHER PAGES PLACEHOLDER */}
      {activeTab !== 'landing' && (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Orbitron', color: 'var(--cyan)' }}>{activeTab.toUpperCase()} PAGE</h2>
          <p style={{ color: 'var(--dim)', marginTop: '10px' }}>Module connected via React State.</p>
        </div>
      )}
    </div>
  );
}