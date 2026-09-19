export const AppHeader = ({ onNewPost }) => (
  <header className="topbar">
    <a className="brand" href="#top" aria-label="SignalDesk home">
      <span className="brand-mark" aria-hidden="true">
        S
      </span>
      <span>
        <strong>SignalDesk</strong>
        <small>Personal signal workspace</small>
      </span>
    </a>

    <div className="topbar-actions">
      <span className="privacy-pill">
        <span className="privacy-dot" aria-hidden="true" />
        Stored on this device
      </span>
      <button className="button button-primary button-compact" type="button" onClick={onNewPost}>
        <span aria-hidden="true">＋</span>
        New post
      </button>
    </div>
  </header>
);
