import { useEffect, useState } from "react";
import type React from "react";
import { getMe, patchMe, type Me } from "../api/me";
import { getToken, clearToken } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [draft, setDraft] = useState<{ firstName: string; lastName: string }>({
    firstName: "",
    lastName: "",
  });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // if no token, bounce to login
    if (!getToken()) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const data = await getMe();
        setMe(data);
        setDraft({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
        });
      } catch (e) {
        setStatus(`❌ ${(e as Error).message}`);
      }
    })();
  }, [navigate]);

  function onEdit() {
    if (!me) return;
    setStatus(null);
    setDraft({
      firstName: me.firstName ?? "",
      lastName: me.lastName ?? "",
    });
    setEditing(true);
  }

  function onCancel() {
    if (!me) return;
    setStatus(null);
    setDraft({
      firstName: me.firstName ?? "",
      lastName: me.lastName ?? "",
    });
    setEditing(false);
  }

  async function onSave(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!me) return;


    const patch: { firstName?: string; lastName?: string } = {};
    if ((draft.firstName ?? "") !== (me.firstName ?? "")) patch.firstName = draft.firstName;
    if ((draft.lastName ?? "") !== (me.lastName ?? "")) patch.lastName = draft.lastName;

    if (Object.keys(patch).length === 0) {
      setEditing(false);
      setStatus("No changes.");
      return;
    }

    try {
      setStatus(null);
      const updated = await patchMe(patch);
      setMe(updated);
      setEditing(false);
      setStatus("✅ Saved.");
    } catch (e) {
      setStatus(`❌ ${(e as Error).message}`);
    }
  }

  function logout() {
    clearToken();
    navigate("/login");
  }

  if (!me) {
    return (
      <div>
        <h2>Profile</h2>
        <p>{status ?? "Loading..."}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Profile</h2>

      <p>
        <b>Username:</b> {me.username}
      </p>
      <p>
        <b>Email:</b> {me.email ?? "—"}
      </p>

      {!editing ? (
        <>
          <p>
            <b>First name:</b> {me.firstName ?? "—"}
          </p>
          <p>
            <b>lastName:</b> {me.lastName ?? "—"}
          </p>

          <button onClick={onEdit}>Edit</button>
          <button onClick={logout} style={{ marginLeft: 8 }}>
            Log out
          </button>
        </>
      ) : (
        <form onSubmit={onSave} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <label>
            First name
            <input
              value={draft.firstName}
              onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
            />
          </label>

          <label>
            lastName
            <textarea
              value={draft.lastName}
              onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
              rows={4}
            />
          </label>

          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
