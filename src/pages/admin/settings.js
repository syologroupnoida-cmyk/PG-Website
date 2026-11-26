import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  if (!(await verifyAdmin(req))) return { redirect: { destination: "/admin/login", permanent: false } };
  return { props: {} };
}

const defaults = {
  propertyName: "Crossing PG",
  supportEmail: "",
  supportPhone: "",
  currency: "INR",
  bookingApproval: true,
  emailNotifications: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      setSettings({ ...defaults, ...(data.settings || {}) });
      setLoading(false);
    }
    loadSettings();
  }, []);

  async function saveSettings(event) {
    event.preventDefault();
    setSaved(false);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (response.ok) setSaved(true);
  }

  return (
    <AdminLayout title="Settings">
      <div className="admin-page-header">
        <div><h2>Property Settings</h2><p>Configure property details and admin preferences.</p></div>
      </div>
      <div className="admin-card">
        {loading ? <div className="empty-state">Loading settings...</div> : (
          <form className="admin-form" onSubmit={saveSettings}>
            {saved && <div className="status confirmed full">Settings saved successfully.</div>}
            <label>Property Name<input value={settings.propertyName} onChange={(e) => setSettings({ ...settings, propertyName: e.target.value })} /></label>
            <label>Support Email<input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} /></label>
            <label>Support Phone<input value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} /></label>
            <label>Currency<select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}><option value="INR">INR - Indian Rupee</option><option value="USD">USD - US Dollar</option></select></label>
            <label className="toggle-row full"><span>Require approval for new bookings</span><input type="checkbox" checked={settings.bookingApproval} onChange={(e) => setSettings({ ...settings, bookingApproval: e.target.checked })} /></label>
            <label className="toggle-row full"><span>Enable email notifications</span><input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} /></label>
            <button className="admin-button" type="submit">Save Settings</button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
