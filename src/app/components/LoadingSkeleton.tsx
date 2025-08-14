"use client";
import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="skeleton" aria-hidden>
      <div className="s-img" />
      <div style={{ flex: 1 }}>
        <div className="s-line short" />
        <div className="s-line" />
      </div>
      <div style={{ width: 40 }} />
    </div>
  );
}
