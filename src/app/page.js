"use client";
import { useState } from "react";
import ProfileAnalyzer from "@/components/ProfileAnalyzer";
import PRReviewer from "@/components/PRReviewer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", padding: "24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Titlebar */}
        <div style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "14px 14px 0 0",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ color: "#484f58", fontSize: 11, marginLeft: 8 }}>devtrack — github intelligence dashboard</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <button
              onClick={() => setActiveTab("profile")}
              style={{
                fontSize: 10, padding: "3px 10px",
                border: `1px solid ${activeTab === "profile" ? "#3fb950" : "#30363d"}`,
                color: activeTab === "profile" ? "#3fb950" : "#484f58",
                background: "transparent", borderRadius: 4, cursor: "pointer",
                fontFamily: "Courier New, monospace"
              }}
            >profile</button>
            <button
              onClick={() => setActiveTab("review")}
              style={{
                fontSize: 10, padding: "3px 10px",
                border: `1px solid ${activeTab === "review" ? "#3fb950" : "#30363d"}`,
                color: activeTab === "review" ? "#3fb950" : "#484f58",
                background: "transparent", borderRadius: 4, cursor: "pointer",
                fontFamily: "Courier New, monospace"
              }}
            >pr review</button>
          </div>
        </div>

        {/* Body */}
        <div style={{
          background: "#0d1117",
          border: "1px solid #30363d",
          borderTop: "none",
          borderRadius: "0 0 14px 14px",
          padding: "24px"
        }}>
          {activeTab === "profile" ? <ProfileAnalyzer /> : <PRReviewer />}
        </div>

      </div>
    </div>
  );
}