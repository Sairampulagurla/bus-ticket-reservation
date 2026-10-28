import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";
const emptyBusForm = {
  busNumber: "",
  busName: "",
  source: "",
  destination: "",
  departureTime: "",
  travelDate: "",
  totalSeats: 40,
};

function App() {
  const [page, setPage] = useState("Dashboard");
  const [buses, setBuses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const [busId, setBusId] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seatsBooked, setSeatsBooked] = useState(1);

  const [busForm, setBusForm] = useState(emptyBusForm);
  const [editingBusId, setEditingBusId] = useState(null);
  const [savingBus, setSavingBus] = useState(false);

  function showMessage(text, type = "info") {
    setMessage(text);
    setMessageType(type);
  }

  async function loadBuses(search = false) {
    setLoading(true);
    try {
      let url = `${API}/buses`;
      if (search) {
        const params = new URLSearchParams();
        if (source.trim()) params.set("source", source.trim());
        if (destination.trim()) params.set("destination", destination.trim());
        if (date) params.set("date", date);
        url += `/search?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load buses.");
      setBuses(data);
      return data;
    } catch (error) {
      showMessage(error.message || "Cannot connect to the backend. Check your server.", "danger");
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadReservations() {
    try {
      const response = await fetch(`${API}/reservations`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load reservations.");
      setReservations(data);
    } catch (error) {
      showMessage(error.message || "Unable to load reservations.", "danger");
    }
  }

  useEffect(() => {loadBuses();}, []);

     // this function is used to navigate to the bus page
  function navigate(name) {
    setPage(name);
    setMessage("");
    if (["Dashboard", "All Buses", "Manage Buses"].includes(name)) loadBuses();
    if (name === "My Reservations") loadReservations();
    if (name !== "Manage Buses") {
      setEditingBusId(null);
      setBusForm(emptyBusForm);
    }
  }

  function searchBuses(event) {
    event.preventDefault();
    setPage("Search Buses");
    loadBuses(true);
  }

  async function bookTicket(event) {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengerName,
          email,
          phone,
          busId,
          seatsBooked: Number(seatsBooked),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed");

      setPassengerName("");
      setEmail("");
      setPhone("");
      setSeatsBooked(1);
      await loadBuses();
      await loadReservations();
      setPage("My Reservations");
      showMessage("Ticket booked successfully!", "success");
    } catch (error) {
      showMessage(error.message || "Unable to book tickets.", "danger");
    }
  }
     

  // this function is used to cancel the ticket 
  async function cancelTicket(id) {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    try {
      const response = await fetch(`${API}/reservations/cancel/${id}`, { method: "PUT" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Cancellation failed");
      await loadReservations();
      await loadBuses();
      showMessage("Ticket cancelled successfully!", "success");
    } catch (error) {
      showMessage(error.message || "Unable to cancel ticket.", "danger");
    }
  }


   
  function updateBusField(event) {
    const { name, value } = event.target;
    setBusForm((current) => ({ ...current, [name]: value }));
  }
  
   
   // this function is used edit to update the bus details in database
  function startEditBus(bus) {
    setEditingBusId(bus._id);
    setBusForm({
      busNumber: bus.busNumber || "",
      busName: bus.busName || "",
      source: bus.source || "",
      destination: bus.destination || "",
      departureTime: bus.departureTime || "",
      travelDate: bus.travelDate ? new Date(bus.travelDate).toISOString().slice(0, 10) : "",
      totalSeats: bus.totalSeats || 40,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetBusForm() {
    setEditingBusId(null);
    setBusForm(emptyBusForm);
  }

  async function saveBus(event) {
    event.preventDefault();
    setSavingBus(true);
    try {
      const editing = Boolean(editingBusId);
      const response = await fetch(
        editing ? `${API}/buses/${editingBusId}` : `${API}/buses`,
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...busForm, totalSeats: Number(busForm.totalSeats) }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save bus.");
      resetBusForm();
      await loadBuses();
      showMessage(editing ? "Bus details updated successfully!" : "Bus added successfully!", "success");
    } catch (error) {
      showMessage(error.message || "Unable to save bus.", "danger");
    } finally {
      setSavingBus(false);
    }
  }

    // this function is used to delete the buses
  async function deleteBus(id) {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;
    try {
      const response = await fetch(`${API}/buses/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete bus.");
      await loadBuses();
      showMessage("Bus deleted successfully!", "success");
    } catch (error) {
      showMessage(error.message || "Unable to delete bus.", "danger");
    }
  }

  const menu = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Search Buses", icon: "🔍" },
    { name: "All Buses", icon: "🚌" },
    { name: "Manage Buses", icon: "⚙️" },
    { name: "Book Tickets", icon: "🎫" },
    { name: "My Reservations", icon: "📋" },
  ];

  const activeReservations = reservations.filter((reservation) => reservation.status === "Booked").length;

  return (
 
      // this is the design of the sidebar
    <div className="app-layout">
      <aside className="sidebar">
        <h3 className="brand">🚌 BusGo</h3>
        <p className="sidebar-caption">TICKET RESERVATION</p>
        <p className="menu-heading">MAIN MENU</p>
        {menu.map((item) => (
          <button
            key={item.name}
            className={`menu-item ${page === item.name ? "active" : ""}`}
            onClick={() => navigate(item.name)}
          >
            <span>{item.icon}</span> {item.name}
          </button>
        ))}
        <div className="sidebar-bottom">
          <p>BusGo Reservation System</p>
          <small>Plan your journey with us.</small>
        </div>
      </aside>


     {/* // top bar view */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h5 className="mb-1">{page}</h5>
            <small className="text-muted">Bus Ticket Reservation System</small>
          </div>
          <span className="user-badge">👤 Passenger</span>
        </header>

        <div className="content-area">
          {message && <div className={`alert alert-${messageType}`}>{message}</div>}


          {/* from here the pages are starting */}

            {/* Dashboard page */}
          {page === "Dashboard" && (
            <>
              <div className="welcome-banner">
                <h2>Welcome to BusGo!</h2>
                <p>Search buses and plan your next journey.</p>
                <button className="btn btn-light" onClick={() => navigate("Search Buses")}>Find a Bus →</button>
              </div>
              <div className="row g-3 my-3">
                <div className="col-md-6"><div className="stat-card"><p>Total Buses</p><h3>{buses.length}</h3></div></div>
                <div className="col-md-6"><div className="stat-card"><p>Active Reservations</p><h3>{activeReservations}</h3></div></div>
              </div>
              <h5 className="mb-3">Quick Actions</h5>
              <div className="row g-3">
                {[["🔍", "Search Buses"], ["🎫", "Book Tickets"], ["📋", "My Reservations"], ["⚙️", "Manage Buses"]].map(([icon, name]) => (
                  <div className="col-md-3" key={name}>
                    <button className="quick-card" onClick={() => navigate(name)}>
                      <span className="quick-icon">{icon}</span><strong>{name}</strong><span className="text-muted">Open module →</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
           
           {/* in the Dashboard if we click search buses it navigate to  search buses page and  all buses too */}
          {(page === "Search Buses" || page === "All Buses") && (
            <>
              {page === "Search Buses" && (
                <div className="search-panel mb-4">
                  <h5>Find Your Journey</h5>
                  <form onSubmit={searchBuses}>
                    <div className="row g-3 mt-1">
                      <div className="col-md-4"><label className="form-label">From</label><input className="form-control" placeholder="Source city" value={source} onChange={(e) => setSource(e.target.value)} /></div>
                      <div className="col-md-4"><label className="form-label">To</label><input className="form-control" placeholder="Destination city" value={destination} onChange={(e) => setDestination(e.target.value)} /></div>
                      <div className="col-md-4"><label className="form-label">Travel Date</label><input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                    </div>
                    <button className="btn btn-primary mt-3">Search Buses</button>
                    <button type="button" className="btn btn-outline-secondary mt-3 ms-2" onClick={() => { setSource(""); setDestination(""); setDate(""); loadBuses(); }}>Clear Search</button>
                  </form>
                </div>
              )}

              {/* this page shows the all pages */}
              <div className="d-flex justify-content-between mb-3"><h5>{page === "All Buses" ? "All Available Buses" : "Search Results"}</h5><span className="text-muted">{buses.length} buses found</span></div>
              {loading && <p>Loading buses...</p>}
              {buses.length === 0 && !loading && <p>No buses found.</p>}
              <div className="row g-3">
                {buses.map((bus) => (
                  <div className="col-lg-6" key={bus._id}>
                    <div className="bus-card">
                      <div className="d-flex justify-content-between"><h5>{bus.busName}</h5><span className="badge bg-success">{bus.availableSeats} seats left</span></div>
                      <p className="text-muted">Bus No: {bus.busNumber}</p>
                      <h6 className="route-text">{bus.source} → {bus.destination}</h6>
                      <p className="mb-1"><strong>Departure:</strong> {bus.departureTime}</p>
                      <p><strong>Date:</strong> {new Date(bus.travelDate).toLocaleDateString()}</p>
                      <button className="btn btn-primary" disabled={bus.availableSeats < 1} onClick={() => { setBusId(bus._id); setPage("Book Tickets"); setMessage(""); }}>Book Tickets</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
            
            {/* this is manage  buses page where can add buses and edit buses */}
          {page === "Manage Buses" && (
            <>
              <div className="form-panel mb-4">
                <h5 className="mb-4">{editingBusId ? "Edit Bus Details" : "Add New Bus"}</h5>
                <form onSubmit={saveBus}>
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Bus Number</label><input className="form-control" name="busNumber" value={busForm.busNumber} onChange={updateBusField} required /></div>
                    <div className="col-md-6"><label className="form-label">Bus Name</label><input className="form-control" name="busName" value={busForm.busName} onChange={updateBusField} required /></div>
                    <div className="col-md-6"><label className="form-label">Source</label><input className="form-control" name="source" value={busForm.source} onChange={updateBusField} required /></div>
                    <div className="col-md-6"><label className="form-label">Destination</label><input className="form-control" name="destination" value={busForm.destination} onChange={updateBusField} required /></div>
                    <div className="col-md-6"><label className="form-label">Departure Time</label><input type="time" className="form-control" name="departureTime" value={busForm.departureTime} onChange={updateBusField} required /></div>
                    <div className="col-md-6"><label className="form-label">Travel Date</label><input type="date" className="form-control" name="travelDate" value={busForm.travelDate} onChange={updateBusField} required /></div>
                    <div className="col-md-6"><label className="form-label">Total Seats</label><input type="number" min="1" className="form-control" name="totalSeats" value={busForm.totalSeats} onChange={updateBusField} required /></div>
                  </div>
                  <button className="btn btn-primary mt-3" type="submit" disabled={savingBus}>{savingBus ? "Saving..." : editingBusId ? "Update Bus" : "Add Bus"}</button>
                  {editingBusId && <button className="btn btn-outline-secondary mt-3 ms-2" type="button" onClick={resetBusForm}>Cancel Edit</button>}
                </form>
              </div>

              <div className="d-flex justify-content-between mb-3"><h5>Existing Buses</h5><span className="text-muted">{buses.length} buses</span></div>
              {buses.length === 0 && <p>No buses available. Add your first bus using the form above.</p>}
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle bg-white">
                  <thead className="table-light"><tr><th>Bus No.</th><th>Name</th><th>Route</th><th>Date</th><th>Seats</th><th>Actions</th></tr></thead>
                  <tbody>
                      {/* it display the buses in table form  */}
                    {buses.map((bus) => (
                      <tr key={bus._id}>
                        <td>{bus.busNumber}</td><td>{bus.busName}</td><td>{bus.source} → {bus.destination}</td>
                        <td>{new Date(bus.travelDate).toLocaleDateString()}</td><td>{bus.availableSeats}/{bus.totalSeats}</td>
                        <td className="text-nowrap"><button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEditBus(bus)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => deleteBus(bus._id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <small className="text-muted">A bus with active bookings cannot be deleted. Cancel its active reservations first.</small>
            </>
          )}

           {/* this is used to book the ticket by user */}
          {page === "Book Tickets" && (
            <div className="form-panel">
              <h5 className="mb-4">Passenger Booking Form</h5>
              <form onSubmit={bookTicket}>
                <div className="mb-3"><label className="form-label">Select Bus</label><select className="form-select" value={busId} onChange={(e) => setBusId(e.target.value)} required><option value="">Choose a bus</option>{buses.filter((bus) => bus.availableSeats > 0).map((bus) => <option key={bus._id} value={bus._id}>{bus.busName} — {bus.source} to {bus.destination} ({bus.availableSeats} seats)</option>)}</select></div>
                <div className="mb-3"><label className="form-label">Passenger Name</label><input className="form-control" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} required /></div>
                <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="mb-3"><label className="form-label">Phone</label><input type="tel" className="form-control" pattern="[0-9]{10}" maxLength="10" minLength="10" placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                <div className="mb-3"><label className="form-label">Number of Seats</label><input type="number" className="form-control" min="1" max={buses.find((bus) => bus._id === busId)?.availableSeats || 1} value={seatsBooked} onChange={(e) => setSeatsBooked(Number(e.target.value))} required /></div>
                <button className="btn btn-primary" type="submit">Confirm Booking</button>
              </form>
            </div>
          )}

          {page === "My Reservations" && (
            <>
              <h5 className="mb-3">My Reservations</h5>
              {reservations.length === 0 && <p>No reservations found.</p>}
              {reservations.map((reservation) => (
                <div className="reservation-card mb-3" key={reservation._id}>
                  <div className="d-flex justify-content-between"><h6>{reservation.passengerName}</h6><span className={`badge ${reservation.status === "Booked" ? "bg-success" : "bg-secondary"}`}>{reservation.status}</span></div>
                  <p className="mb-1">{reservation.bus ? `${reservation.bus.busName}: ${reservation.bus.source} → ${reservation.bus.destination}` : "Bus details unavailable"}</p>
                  <p className="mb-1">Email: {reservation.email}</p>
                  <p className="mb-2">Seats booked: {reservation.seatsBooked}</p>
                  {reservation.status === "Booked" && <button className="btn btn-outline-danger btn-sm" onClick={() => cancelTicket(reservation._id)}>Cancel Ticket</button>}
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
