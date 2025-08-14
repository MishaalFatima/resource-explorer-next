"use client";
import React from "react";
import Link from "next/link";

export type Character = {
  id: number;
  name: string;
  status?: string;
  species?: string;
  gender?: string;
  image?: string;
  origin?: { name?: string };
};

type Props = {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function CharacterCard({ character, isFavorite, onToggleFavorite }: Props) {
  return (
    <article className="card" role="article" aria-labelledby={`title-${character.id}`}>
      <img src={character.image} alt={character.name} width={88} height={88} />

      <div className="card-body">
        <Link href={`/characters/${character.id}`} id={`title-${character.id}`} className="card-title">
          {character.name}
        </Link>
        <div className="card-meta">
          <span>{character.species}</span>
          <span>•</span>
          <span>{character.status}</span>
          <span>•</span>
          <span>{character.gender}</span>
        </div>

        <div className="card-actions">
          <small className="muted">Origin: {character.origin?.name ?? "Unknown"}</small>
        </div>
      </div>

      <button
        type="button"
        className={`fav-btn ${isFavorite ? "active" : ""}`}
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        title={isFavorite ? "Remove favorite" : "Add favorite"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </article>
  );
}
