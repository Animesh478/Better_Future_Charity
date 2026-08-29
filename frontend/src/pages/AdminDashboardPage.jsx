import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import {
  fetchAllCharities,
  approveCharity,
  modifyCharityStatus,
  fetchAllUsers,
  changeUserRole,
} from "../services/adminApi";
import "./AdminDashboardPage.css";

const CHARITY_STATUSES = ["Pending", "Approved", "Rejected", "Suspended"];
const USER_ROLES = ["Donor", "Charity", "Admin"];

function CharitiesTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ charities: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllCharities({ search, page, limit: 10 });
      setResult(data);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleApprove(charityId) {
    setBusyId(charityId);
    setActionError(null);
    try {
      await approveCharity(charityId);
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleStatusChange(charityId, targetStatus) {
    setBusyId(charityId);
    setActionError(null);
    try {
      await modifyCharityStatus(charityId, targetStatus);
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil((result.totalItems || 0) / 10));

  return (
    <div>
      <div className="admin-search-row">
        <input
          type="text"
          placeholder="Search charities by name or description…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {actionError && <div className="admin-banner error">{actionError}</div>}

      {loading ? (
        <div className="admin-status">Loading charities…</div>
      ) : result.charities.length === 0 ? (
        <div className="admin-status">No charities found.</div>
      ) : (
        <div className="admin-table">
          <div className="admin-table-head charities">
            <span>Charity</span>
            <span>Owner</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {result.charities.map((c) => (
            <div className="admin-table-row charities" key={c.id}>
              <span>
                <div className="admin-row-title">{c.name}</div>
                <div className="admin-row-sub">
                  Reg. No. {c.registrationNumber}
                </div>
              </span>
              <span>
                <div className="admin-row-title">{c.owner?.name}</div>
                <div className="admin-row-sub">{c.owner?.email}</div>
              </span>
              <span>
                <span
                  className={`admin-status-badge ${c.status.toLowerCase()}`}
                >
                  {c.status}
                </span>
              </span>
              <span className="admin-row-actions">
                {c.status === "Pending" && (
                  <button
                    className="admin-btn-solid"
                    disabled={busyId === c.id}
                    onClick={() => handleApprove(c.id)}
                  >
                    Approve
                  </button>
                )}
                <select
                  disabled={busyId === c.id}
                  value=""
                  onChange={(e) => {
                    if (e.target.value)
                      handleStatusChange(c.id, e.target.value);
                  }}
                >
                  <option value="">Change status…</option>
                  {CHARITY_STATUSES.filter((s) => s !== c.status).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ users: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers({ search, page, limit: 10 });
      setResult(data);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleRoleChange(userId, targetRole) {
    setBusyId(userId);
    setActionError(null);
    try {
      await changeUserRole(userId, targetRole);
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil((result.totalItems || 0) / 10));

  return (
    <div>
      <div className="admin-search-row">
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {actionError && <div className="admin-banner error">{actionError}</div>}

      {loading ? (
        <div className="admin-status">Loading users…</div>
      ) : result.users.length === 0 ? (
        <div className="admin-status">No users found.</div>
      ) : (
        <div className="admin-table">
          <div className="admin-table-head users">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </div>
          {result.users.map((u) => (
            <div className="admin-table-row users" key={u.id}>
              <span>{u.name}</span>
              <span>{u.email}</span>
              <span>
                <span className={`admin-role-badge ${u.role.toLowerCase()}`}>
                  {u.role}
                </span>
              </span>
              <span className="admin-row-actions">
                <select
                  disabled={busyId === u.id}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) handleRoleChange(u.id, e.target.value);
                  }}
                >
                  <option value="">Change role…</option>
                  {USER_ROLES.filter((r) => r !== u.role).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("charities");

  return (
    <div className="admin-root">
      <Navbar />

      <section className="admin-hero">
        <div className="admin-hero-tag">Admin</div>
        <h1>Platform management</h1>
        <p>Review charity applications and manage user roles.</p>
      </section>

      <section className="admin-body">
        <div className="admin-tabs">
          <button
            className={tab === "charities" ? "active" : ""}
            onClick={() => setTab("charities")}
          >
            Charities
          </button>
          <button
            className={tab === "users" ? "active" : ""}
            onClick={() => setTab("users")}
          >
            Users
          </button>
        </div>

        {tab === "charities" ? <CharitiesTab /> : <UsersTab />}
      </section>
    </div>
  );
}
