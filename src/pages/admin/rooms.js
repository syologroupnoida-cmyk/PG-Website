
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  if (!(await verifyAdmin(req))) return { redirect: { destination: "/admin/login", permanent: false } };
  return { props: {} };
}

const blankRoom = {
  roomNumber: "", sharingType: "Single", totalBeds: 1, availableBeds: 1,
  monthlyRent: "", securityDeposit: "", amenities: "", description: "", isActive: true,
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankRoom);

  async function loadRooms() {
    const response = await fetch("/api/admin/rooms");
    const data = await response.json();
    setRooms(data.rooms || []);
    setLoading(false);
  }

  useEffect(() => { loadRooms(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(blankRoom);
    setModal(true);
  }

  function openEdit(room) {
    setEditing(room);
    setForm({
      ...room,
      amenities: (room.amenities || []).join(", "),
      monthlyRent: room.monthlyRent,
      securityDeposit: room.securityDeposit,
    });
    setModal(true);
  }

  async function saveRoom(event) {
    event.preventDefault();
    const payload = {
      ...form,
      totalBeds: Number(form.totalBeds),
      availableBeds: Number(form.availableBeds),
      monthlyRent: Number(form.monthlyRent),
      securityDeposit: Number(form.securityDeposit),
      amenities: String(form.amenities).split(",").map((item) => item.trim()).filter(Boolean),
    };
    const response = await fetch("/api/admin/rooms", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing._id, ...payload } : payload),
    });
    if (response.ok) {
      setModal(false);
      loadRooms();
    }
  }

  async function deleteRoom(room) {
    if (!window.confirm(`Delete room ${room.roomNumber}?`)) return;
    await fetch(`/api/admin/rooms?id=${room._id}`, { method: "DELETE" });
    loadRooms();
  }

  return (
    <AdminLayout title="Room Management">
      <div className="admin-page-header">
        <div><h2>Rooms</h2><p>Add, update and manage room availability.</p></div>
        <button className="admin-button" onClick={openCreate}>+ Add Room</button>
      </div>
      <div className="admin-card">
        {loading ? <div className="empty-state">Loading rooms...</div> : rooms.length === 0 ? (
          <div className="empty-state">No rooms have been added yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Room</th><th>Type</th><th>Beds</th><th>Rent</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{rooms.map((room) => (
                <tr key={room._id}>
                  <td><strong>{room.roomNumber}</strong></td>
                  <td>{room.sharingType}</td>
                  <td>{room.availableBeds}/{room.totalBeds}</td>
                  <td>₹{Number(room.monthlyRent).toLocaleString("en-IN")}</td>
                  <td><span className={`status ${room.isActive ? "confirmed" : "cancelled"}`}>{room.isActive ? "Active" : "Inactive"}</span></td>
                  <td>
                    <button className="admin-button secondary" onClick={() => openEdit(room)}>Edit</button>{" "}
                    <button className="admin-button danger" onClick={() => deleteRoom(room)}>Delete</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header"><h3>{editing ? "Edit Room" : "Add New Room"}</h3><button className="admin-button secondary" onClick={() => setModal(false)}>Close</button></div>
            <form className="admin-form" onSubmit={saveRoom}>
              <label>Room Number<input required value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} /></label>
              <label>Sharing Type<select value={form.sharingType} onChange={(e) => setForm({ ...form, sharingType: e.target.value })}><option>Single</option><option>Double</option><option>Triple</option></select></label>
              <label>Total Beds<input required type="number" min="1" value={form.totalBeds} onChange={(e) => setForm({ ...form, totalBeds: e.target.value })} /></label>
              <label>Available Beds<input required type="number" min="0" value={form.availableBeds} onChange={(e) => setForm({ ...form, availableBeds: e.target.value })} /></label>
              <label>Monthly Rent (₹)<input required type="number" min="0" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} /></label>
              <label>Security Deposit (₹)<input required type="number" min="0" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} /></label>
              <label className="full">Amenities<input value={form.amenities} placeholder="Wi-Fi, AC, Meals" onChange={(e) => setForm({ ...form, amenities: e.target.value })} /></label>
              <label className="full">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <label className="toggle-row full"><span>Active room</span><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /></label>
              <button className="admin-button full" type="submit">{editing ? "Save Changes" : "Add Room"}</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
