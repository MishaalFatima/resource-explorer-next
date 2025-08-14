"use client";
import React from "react";

type Props = {
  status: string;
  setStatus: (s: string) => void;
  species: string;
  setSpecies: (s: string) => void;
  showFavorites: boolean;
  setShowFavorites: (b: boolean) => void;
  sort: string;
  setSort: (s: string) => void;
};

export default function Filters({
  status,
  setStatus,
  species,
  setSpecies,
  showFavorites,
  setShowFavorites,
  sort,
  setSort,
}: Props) {
  return (
    <div className="filters" role="region" aria-label="Filters and sorting">
      <select
        className="select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="Status filter"
      >
        <option value="">All status</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>

      <input
        className="text-input"
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        placeholder="Species (e.g. Human)"
        aria-label="Species filter"
      />

      <label className="checkbox-inline">
        <input
          type="checkbox"
          checked={showFavorites}
          onChange={(e) => setShowFavorites(e.target.checked)}
        />
        <span style={{ color: "var(--muted)" }}>Favorites</span>
      </label>

      <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
        <option value="name_asc">Name ↑</option>
        <option value="name_desc">Name ↓</option>
        <option value="id_asc">ID ↑</option>
        <option value="id_desc">ID ↓</option>
      </select>
    </div>
  );
}
