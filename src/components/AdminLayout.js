
import { useRouter } from "next/router";

const menu = [
  ["▦", "Dashboard", "/admin/dashboard"],
  ["▣", "Room Management", "/admin/rooms"],
  ["♙", "Customer Management", "/admin/customers"],
  ["▤", "Bookings", "/admin/bookings"],
  ["₹", "Payments", "/admin/payments"],
  ["▥", "Reports", "/admin/reports"],
  ["⚙", "Settings", "/admin/settings"],
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">CPG</div>
          <div>
            <h2>Crossing PG</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <p className="menu-title">MAIN MENU</p>

        <nav>
          {menu.map(([icon, name, path]) => (
            <button
              key={path}
              className={
                router.pathname === path
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => router.push(path)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <button className="logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <span>Crossing PG Admin</span>
        </header>

        <div className="content">{children}</div>
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 255px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          background: #172554;
          color: white;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 45px;
        }

        .logo {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          background: #2563eb;
          border-radius: 10px;
          font-size: 19px;
          font-weight: bold;
        }

        .brand h2 { font-size: 16px; margin: 0 0 5px; }
        .brand span { color: #93c5fd; font-size: 10px; }
        .menu-title { color: #94a3b8; font-size: 11px; margin: 0 10px 15px; }
        nav { display: flex; flex-direction: column; gap: 8px; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 13px;
          width: 100%;
          padding: 13px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #cbd5e1;
          text-align: left;
          font-size: 14px;
          cursor: pointer;
        }

        .nav-item span { width: 22px; font-size: 19px; }
        .nav-item:hover, .nav-item.active {
          background: #2563eb;
          color: white;
        }

        .logout {
          margin-top: auto;
          padding: 13px;
          border: none;
          background: transparent;
          color: #fca5a5;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .main { flex: 1; min-width: 0; padding: 25px; }
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .topbar h1 { color: #172554; font-size: 22px; margin: 0; }
        .topbar span { color: #64748b; font-size: 13px; }
        .content { margin-top: 22px; }

        @media (max-width: 760px) {
          .sidebar { width: 75px; padding: 20px 8px; }
          .brand div:last-child, .menu-title { display: none; }
          .brand { justify-content: center; }
          .nav-item { justify-content: center; padding: 14px 5px; font-size: 0; }
          .logout { text-align: center; font-size: 0; }
          .main { padding: 14px; }
          .topbar span { display: none; }
        }
      `}</style>
    </div>
  );
}
