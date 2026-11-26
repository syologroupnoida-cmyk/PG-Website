
import { useState } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import verifyAdmin from "../../lib/adminAuth";

export async function getServerSideProps({ req }) {
  const admin = await verifyAdmin(req);

  if (admin) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      await router.replace("/admin/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo">CPG</div>
        <h1>Crossing PG</h1>
        <p className="subtitle">Admin Portal</p>

        <div className="welcome">
          <h2>Welcome Back!</h2>
          <p>Login to manage your PG business.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label htmlFor="admin-email">Email Address</label>

          <div className="input-box">
            <Mail size={18} aria-hidden="true" />
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>

          <div className="password-box">
            <LockKeyhole className="password-icon" size={18} aria-hidden="true" />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>

        </form>

        <div className="footer">
          © 2026 Crossing PG. All rights reserved.
        </div>

      </div>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #eff6ff;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          background: white;
          padding: 38px;
          border-radius: 16px;
          box-shadow: 0 10px 35px rgba(30,64,175,0.10);
        }

        .logo {
          width: 58px;
          height: 58px;
          background: #2563eb;
          color: white;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 24px;
          font-weight: bold;
          margin: 0 auto 15px;
        }

        h1 {
          text-align: center;
          color: #172554;
          font-size: 25px;
          margin: 0;
        }

        .subtitle {
          text-align: center;
          color: #2563eb;
          font-size: 13px;
          margin: 8px 0 30px;
        }

        .welcome h2 {
          color: #172554;
          font-size: 21px;
          margin-bottom: 7px;
        }

        .welcome p {
          color: #64748b;
          font-size: 13px;
          margin-bottom: 25px;
        }

        label {
          display: block;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          margin: 18px 0 8px;
        }

        .input-box,
        .password-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-box :global(svg),
        .password-icon {
          position: absolute;
          left: 13px;
          z-index: 1;
          color: #94a3b8;
          pointer-events: none;
        }

        input {
          width: 100%;
          padding: 13px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
        }

        .input-box input {
          padding-left: 42px;
        }

        input:focus {
          border-color: #2563eb;
        }

        .password-box input {
          padding-left: 42px;
          padding-right: 52px;
        }

        .password-box button {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          margin-top: 25px;
          cursor: pointer;
        }

        .login-button:hover {
          background: #1d4ed8;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 12px;
          border-radius: 7px;
          color: #b91c1c;
          background: #fee2e2;
          font-size: 13px;
        }

        .footer {
          text-align: center;
          color: #94a3b8;
          font-size: 11px;
          margin-top: 30px;
        }

        @media(max-width: 480px) {
          .login-card {
            padding: 25px;
          }
        }

      `}</style>

    </div>
  );
}
