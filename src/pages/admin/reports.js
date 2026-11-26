import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  if (!(await verifyAdmin(req))) return { redirect: { destination: "/admin/login", permanent: false } };
  return { props: {} };
}

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      const response = await fetch("/api/admin/reports");
      const data = await response.json();
      setReport(data.report || null);
      setLoading(false);
    }
    loadReport();
  }, []);

  const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  const metrics = report ? [
    ["Total Revenue", money(report.totalRevenue)],
    ["Monthly Revenue", money(report.monthlyRevenue)],
    ["Total Bookings", report.totalBookings],
    ["Confirmed Bookings", report.confirmedBookings],
  ] : [];

  return (
    <AdminLayout title="Reports">
      <div className="admin-page-header">
        <div><h2>Business Reports</h2><p>Revenue, booking and occupancy performance.</p></div>
        <button className="admin-button secondary" onClick={() => window.print()}>Print Report</button>
      </div>
      {loading ? (
        <div className="admin-card empty-state">Loading reports...</div>
      ) : report ? (
        <>
          <div className="admin-grid-4">
            {metrics.map(([label, value]) => (
              <div className="admin-metric" key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
          <div className="admin-grid-2" style={{ marginTop: 16 }}>
            <div className="admin-card">
              <h3>Occupancy</h3>
              <strong style={{ color: "#2563eb", fontSize: 38 }}>{report.occupancyRate}%</strong>
              <p style={{ color: "#64748b" }}>Across {report.totalRooms} active properties.</p>
            </div>
            <div className="admin-card">
              <h3>Booking Conversion</h3>
              <strong style={{ color: "#16a34a", fontSize: 38 }}>
                {report.totalBookings ? Math.round((report.confirmedBookings / report.totalBookings) * 100) : 0}%
              </strong>
              <p style={{ color: "#64748b" }}>{report.confirmedBookings} confirmed bookings.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="admin-card empty-state">Unable to load reports.</div>
      )}
    </AdminLayout>
  );
}
