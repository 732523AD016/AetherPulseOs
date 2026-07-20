import "./Dashboard.css";

function Dashboard() {
  return (
    <section className="dashboard">

      <h2>Dashboard Overview</h2>

      <div className="cards">

        <div className="card">
          <h3>Patients</h3>
          <h1>1,250</h1>
        </div>

        <div className="card">
          <h3>Doctors</h3>
          <h1>120</h1>
        </div>

        <div className="card">
          <h3>Hospitals</h3>
          <h1>35</h1>
        </div>

      </div>

    </section>
  );
}

export default Dashboard;