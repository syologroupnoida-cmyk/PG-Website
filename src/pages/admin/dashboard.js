
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  const admin = await verifyAdmin(req);

  if (!admin) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function AdminDashboard() {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();

        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Dashboard failed.");
        }

        setAdmin(data.admin);
        setStats(data.statistics);
        setBookings(data.recentBookings || []);
        setPayments(data.recentPayments || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin/login");
    }
  }

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  if (loading) {
    return <div className="loading">Loading Crossing PG...</div>;
  }

  if (!admin) {
    return <div className="loading">Redirecting to login...</div>;
  }

  const menu = [
    ["▦", "Dashboard", "/admin/dashboard"],
    ["▣", "Room Management", "/admin/rooms"],
    ["♙", "Customer Management", "/admin/customers"],
    ["▤", "Bookings", "/admin/bookings"],
    ["₹", "Payments", "/admin/payments"],
    ["▥", "Reports", "/admin/reports"],
    ["⚙", "Settings", "/admin/settings"],
  ];

  const cards = [
    {
      title: "Total Rooms",
      value: stats.totalRooms ?? 0,
      icon: "▣",
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      title: "Customers",
      value: stats.totalCustomers ?? 0,
      icon: "♙",
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      title: "Bookings",
      value: stats.totalBookings ?? 0,
      icon: "▤",
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      title: "Revenue",
      value: money(stats.totalRevenue),
      icon: "₹",
      color: "#9333ea",
      bg: "#faf5ff",
    },
  ];

  return (
    <div className="layout">

      {/* SIDEBAR */}

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
              key={name}
              className={
                name === "Dashboard" ? "nav-item active" : "nav-item"
              }
              onClick={() => router.push(path)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <button className="logout" onClick={handleLogout}>
          <span>↪</span> Logout
        </button>

      </aside>

      {/* MAIN DASHBOARD */}

      <main className="main">

        <header className="topbar">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Manage your PG business from one place.</p>
          </div>

          <div className="profile">
            <div className="avatar">
              {admin.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{admin.name}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="welcome">
          <h2>Welcome to Crossing PG 👋</h2>
          <p>Here's what's happening with your PG business today.</p>
        </section>

        {/* STATISTICS */}

        <section className="stats-grid">
          {cards.map((card) => (
            <div className="stat-card" key={card.title}>
              <div
                className="stat-icon"
                style={{
                  color: card.color,
                  background: card.bg,
                }}
              >
                {card.icon}
              </div>

              <h2>{card.value}</h2>
              <p>{card.title}</p>
            </div>
          ))}
        </section>

        {/* REVENUE */}

        <section className="revenue-grid">
          <div className="revenue-card">
            <p>Monthly Revenue</p>
            <h2>{money(stats.monthlyRevenue)}</h2>
            <span>Successful payments this month</span>
          </div>

          <div className="revenue-card">
            <p>Available Rooms</p>
            <h2>{stats.availableRooms ?? 0}</h2>
            <span>Rooms currently available</span>
          </div>
        </section>

        {/* RECENT BOOKINGS */}

        <section className="table-card">
          <h3>Recent Bookings</h3>

          {bookings.length === 0 ? (
            <p className="empty">No bookings available yet.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Room</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={booking._id || index}>
                      <td>
                        {booking.bookingId || booking._id?.toString()}
                      </td>
                      <td>
                        {booking.customerName ||
                          booking.customer?.fullName ||
                          "Customer"}
                      </td>
                      <td>
                        {booking.roomNumber ||
                          booking.room?.roomNumber ||
                          "—"}
                      </td>
                      <td>{booking.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RECENT PAYMENTS */}

        <section className="table-card">
          <h3>Recent Payments</h3>

          {payments.length === 0 ? (
            <p className="empty">No payments available yet.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment._id || index}>
                      <td>
                        {payment.transactionId ||
                          payment._id?.toString()}
                      </td>
                      <td>{money(payment.amount)}</td>
                      <td>{payment.paymentMethod || "—"}</td>
                      <td>{payment.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          © 2026 Crossing PG. All rights reserved.
        </footer>

      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

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

        .brand h2 {
          margin: 0 0 5px;
          font-size: 16px;
        }

        .brand span {
          color: #93c5fd;
          font-size: 10px;
        }

        .menu-title {
          margin: 0 10px 15px;
          color: #94a3b8;
          font-size: 11px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

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

        .nav-item span {
          width: 22px;
          font-size: 19px;
        }

        .nav-item:hover,
        .nav-item.active {
          background: #2563eb;
          color: white;
        }

        .logout {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: auto;
          padding: 13px;
          border: none;
          background: transparent;
          color: #fca5a5;
          cursor: pointer;
          font-size: 14px;
        }

        .main {
          flex: 1;
          min-width: 0;
          padding: 25px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .topbar h1 {
          margin: 0 0 7px;
          color: #172554;
          font-size: 22px;
        }

        .topbar p,
        .welcome p {
          color: #64748b;
          font-size: 13px;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #dbeafe;
          color: #1d4ed8;
          font-weight: bold;
        }

        .profile strong,
        .profile span {
          display: block;
          font-size: 12px;
        }

        .profile strong {
          color: #172554;
        }

        .profile span {
          color: #64748b;
          margin-top: 4px;
        }

        .welcome {
          margin: 28px 0 22px;
        }

        .welcome h2 {
          color: #172554;
          font-size: 21px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .stat-card,
        .revenue-card,
        .table-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px;
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          font-size: 21px;
        }

        .stat-card h2 {
          margin: 16px 0 7px;
          color: #172554;
          font-size: 26px;
        }

        .stat-card p,
        .revenue-card p {
          color: #64748b;
          font-size: 13px;
        }

        .revenue-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-top: 22px;
        }

        .revenue-card h2 {
          color: #2563eb;
          font-size: 26px;
        }

        .revenue-card span {
          color: #94a3b8;
          font-size: 12px;
        }

        .table-card {
          margin-top: 22px;
        }

        .table-card h3 {
          color: #172554;
          font-size: 17px;
        }

        .table-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 550px;
          border-collapse: collapse;
          text-align: left;
        }

        th, td {
          padding: 14px 10px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }

        th {
          background: #f8fafc;
          color: #64748b;
        }

        td {
          color: #334155;
        }

        .empty {
          color: #94a3b8;
          font-size: 13px;
        }

        footer {
          padding: 25px 0 5px;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }

        .loading {
          padding: 40px;
          color: #172554;
        }

        @media(max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media(max-width: 760px) {
          .sidebar {
            width: 75px;
            padding: 20px 8px;
          }

          .brand div:last-child,
          .menu-title {
            display: none;
          }

          .brand {
            justify-content: center;
          }

          .nav-item {
            justify-content: center;
            padding: 14px 5px;
            font-size: 0;
          }

          .logout {
            justify-content: center;
            font-size: 0;
          }

          .main {
            padding: 14px;
          }
        }

        @media(max-width: 550px) {
          .stats-grid,
          .revenue-grid {
            grid-template-columns: 1fr;
          }

          .profile div:last-child {
            display: none;
          }
        }
      `}</style>

    </div>
  );
}
