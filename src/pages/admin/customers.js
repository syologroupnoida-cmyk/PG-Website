import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  if (!(await verifyAdmin(req))) return { redirect: { destination: "/admin/login", permanent: false } };
  return { props: {} };
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCustomers(query = "") {
    setLoading(true);
    const response = await fetch(`/api/admin/customers${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    const data = await response.json();
    setCustomers(data.customers || []);
    setLoading(false);
  }

  useEffect(() => { loadCustomers(); }, []);

  return (
    <AdminLayout title="Customer Management">
      <div className="admin-page-header">
        <div><h2>Customers</h2><p>View customer profiles and contact information.</p></div>
      </div>
      <div className="admin-card">
        <div className="admin-toolbar">
          <input className="admin-search" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadCustomers(search)} placeholder="Search name, email or phone..." />
          <button className="admin-button" onClick={() => loadCustomers(search)}>Search</button>
        </div>
        {loading ? <div className="empty-state">Loading customers...</div> : customers.length === 0 ? (
          <div className="empty-state">No customers found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
              <tbody>{customers.map((customer) => (
                <tr key={customer._id}>
                  <td><strong>{customer.firstName} {customer.lastName}</strong></td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || "—"}</td>
                  <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
