function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Fields match models/charity.js exactly: id, name, description,
// registrationNumber, status, createdAt. Public listings are pre-filtered to
// status "Approved", so every card shown here is a verified organization —
// there's no per-project goal/raised amount to show yet (see note in
// BrowseCharitiesPage.jsx about the missing public projects endpoint).
export default function CharityCard({ charity, onDonateClick }) {
  return (
    <div className="gwl-card">
      <div className="gwl-card-media">
        <div className="gwl-card-media-fallback">{initials(charity.name)}</div>
        <span className="gwl-card-verified">Verified</span>
      </div>

      <div className="gwl-card-body">
        <div className="gwl-card-meta">
          <span>Reg. No. {charity.registrationNumber}</span>
        </div>

        <h3 className="gwl-card-title">{charity.name}</h3>
        <p className="gwl-card-mission">{charity.description}</p>

        <button
          className="gwl-card-donate"
          onClick={() => onDonateClick(charity)}
        >
          View & Donate
        </button>
      </div>
    </div>
  );
}
