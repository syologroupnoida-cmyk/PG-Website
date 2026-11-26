import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  if (!(await verifyAdmin(req))) return { redirect: { destination: "/admin/login", permanent: false } };
  return { props: {} };
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  async function loadBookings() {
    const response = await fetch("/api/admin/bookings");
    const data = await response.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }

  useEffect(() => { loadBookings(); }, []);

  async function updateStatus(booking, status) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: booking._id, status }),
    });
    loadBookings();
  }

  const filtered = filter === "All" ? bookings : bookings.filter((booking) => booking.status === filter);

  return (
    <AdminLayout title="Booking Management">
      <div className="admin-page-header">
        <div><h2>Bookings</h2><p>Review and update customer booking requests.</p></div>
        <select className="admin-search" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="admin-card">
        {loading ? <div className="empty-state">Loading bookings...</div> : filtered.length === 0 ? (
          <div className="empty-state">No bookings match this filter.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Booking</th><th>Customer</th><th>Room</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{filtered.map((booking) => (
                <tr key={booking._id}>
                  <td><strong>{booking.bookingId}</strong></td>
                  <td>{booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : "—"}</td>
                  <td>{booking.room?.roomNumber || "—"}</td>
                  <td>₹{Number(booking.amount || 0).toLocaleString("en-IN")}</td>
                  <td><span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                  <td>
                    <select value={booking.status} onChange={(e) => updateStatus(booking, e.target.value)}>
                      {["Pending", "Confirmed", "Cancelled", "Completed"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
