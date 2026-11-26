import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  if (!(await verifyAdmin(req))) return { redirect: { destination: "/admin/login", permanent: false } };
  return { props: {} };
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPayments() {
    const response = await fetch("/api/admin/payments");
    const data = await response.json();
    setPayments(data.payments || []);
    setLoading(false);
  }

  useEffect(() => { loadPayments(); }, []);

  async function updateStatus(payment, status) {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: payment._id, status }),
    });
    loadPayments();
  }

  return (
    <AdminLayout title="Payment Management">
      <div className="admin-page-header">
        <div><h2>Payments</h2><p>Track Razorpay transactions and payment status.</p></div>
      </div>
      <div className="admin-card">
        {loading ? <div className="empty-state">Loading payments...</div> : payments.length === 0 ? (
          <div className="empty-state">No transactions have been recorded.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Booking</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{payments.map((payment) => (
                <tr key={payment._id}>
                  <td><strong>{payment.razorpayOrderId}</strong></td>
                  <td>{payment.customer ? `${payment.customer.firstName} ${payment.customer.lastName}` : "—"}</td>
                  <td>{payment.booking?.bookingId || "—"}</td>
                  <td>₹{Number(payment.amount || 0).toLocaleString("en-IN")}</td>
                  <td><span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                  <td>
                    <select value={payment.status} onChange={(e) => updateStatus(payment, e.target.value)}>
                      {["Created", "Paid", "Failed", "Refunded"].map((status) => <option key={status}>{status}</option>)}
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
