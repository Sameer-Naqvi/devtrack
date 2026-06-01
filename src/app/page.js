"use client";
import { useState } from "react";
import ProfileAnalyzer from "@/components/ProfileAnalyzer";
import PRReviewer from "@/components/PRReviewer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile");
  const [prUrl, setPrUrl] = useState("");

  const handlePRClick = (url) => {
    setPrUrl(url);
    setActiveTab("review");
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "profile") {
      setPrUrl("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", padding: "24px", fontSize: 14 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          background: "#161b22", border: "1px solid #30363d",
          borderRadius: "14px 14px 0 0", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ color: "#484f58", fontSize: 13, marginLeft: 8 }}>devtrack — github intelligence dashboard</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <button
              onClick={() => handleTabSwitch("profile")}
              style={{
                fontSize: 12, padding: "4px 12px",
                border: `1px solid ${activeTab === "profile" ? "#3fb950" : "#30363d"}`,
                color: activeTab === "profile" ? "#3fb950" : "#484f58",
                background: "transparent", borderRadius: 4, cursor: "pointer",
                fontFamily: "Courier New, monospace"
              }}
            >profile</button>
            <button
              onClick={() => handleTabSwitch("review")}
              style={{
                fontSize: 12, padding: "4px 12px",
                border: `1px solid ${activeTab === "review" ? "#3fb950" : "#30363d"}`,
                color: activeTab === "review" ? "#3fb950" : "#484f58",
                background: "transparent", borderRadius: 4, cursor: "pointer",
                fontFamily: "Courier New, monospace"
              }}
            >pr review</button>
          </div>
        </div>

        <div style={{
          background: "#0d1117", border: "1px solid #30363d",
          borderTop: "none", borderRadius: "0 0 14px 14px", padding: "28px"
        }}>
          {activeTab === "profile"
            ? <ProfileAnalyzer onPRClick={handlePRClick} />
            : <PRReviewer initialUrl={prUrl} />}
        </div>
      </div>
    </div>
  );
}