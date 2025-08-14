"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Search characters by name…" }: Props) {
  return (
    <div className="search-wrap" role="search" aria-label="Search characters">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        className="search-input"
        type="search"
        value={value ?? ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
