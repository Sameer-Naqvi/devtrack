"use client";
import { useState } from "react";
import ProfileAnalyzer from "@/components/ProfileAnalyzer";
import PRReviewer from "@/components/PRReviewer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">DevTrack</h1>
          <p className="text-gray-400 text-sm">GitHub Intelligence Dashboard</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Profile Analyzer
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "review"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            PR Reviewer
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-8 py-10">
        {activeTab === "profile" ? <ProfileAnalyzer /> : <PRReviewer />}
      </main>
    </div>
  );
}