import { useState } from "react";
import type React from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    setStatus(null);

    try {
      await login({ username, password });
      setStatus("✅ Logged in (token saved). Try a protected API next.");

      await sleep(1000);
      navigate("/city");
    } catch (err) {
      setStatus(`❌ ${(err as Error).message}`);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Password
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Login</button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
