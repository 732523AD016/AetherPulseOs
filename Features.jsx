import "./Features.css";

function Features() {
  return (
    <section className="features">

      <h2>Key Features</h2>

      <div className="cards">

        <div className="card">
          <h3>Emergency SOS</h3>
          <p>Instant emergency alerts.</p>
        </div>

        <div className="card">
          <h3>AI Health Assistant</h3>
          <p>AI-powered healthcare guidance.</p>
        </div>

        <div className="card">
          <h3>Hospital Dashboard</h3>
          <p>Monitor patients in real time.</p>
        </div>

      </div>

    </section>
  );
}

export default Features;