function Header() {
  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        borderBottom: "1px solid #1f2937",
        position: "relative"
      }}
    >
      {/* CENTER CONTENT */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            color: "#60a5fa",
            fontWeight: "600"
          }}
        >
          AI DevOps Copilot
        </h1>

        <p
          style={{
            margin: 4,
            fontSize: "25px",
            color: "#94a3b8"
          }}
        >
          Real-time observability & AI automation system
        </p>
      </div>

      {/* RIGHT STATUS (floating) */}
      <div
        style={{
          position: "absolute",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          Status
        </span>

        <span
          style={{
            color: "#22c55e",
            fontSize: "12px",
            animation: "pulse 1.5s infinite"
          }}
        >
          ● ONLINE
        </span>
      </div>
    </div>
  );
}

export default Header;