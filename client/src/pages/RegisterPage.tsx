import { useState } from "react";
import { register } from "../api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    setStatus(null);

    try {
      await register({ username, password, firstName, lastName, email });
      setStatus("✅ Registered and logged in (token saved).");
    } catch (err) {
      setStatus(`❌ ${(err as Error).message}`);
    }
  }

  return (
    <div>
      <h2>Register</h2>
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

        <label>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>

        <label>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <button type="submit">Create account</button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
