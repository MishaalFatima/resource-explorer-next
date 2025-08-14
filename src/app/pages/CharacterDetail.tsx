// src/app/pages/CharacterDetail.tsx
"use client";

import React, { JSX, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { fetchCharacterById, type Character } from "../lib/api";
import { useFavorites } from "../hooks/useFavorites";

export default function CharacterDetailPage(): JSX.Element {
  const params = useParams() as { id?: string } | null;
  const id = params?.id ?? undefined;
  const router = useRouter();
  const fav = useFavorites();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["character", id],
    queryFn: async ({ signal }) => {
      if (!id) throw new Error("no id");
      return fetchCharacterById(id, signal);
    },
    enabled: !!id,
    staleTime: 1000 * 60
  });

  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(`note_char_${id}`);
      if (raw) setNote(raw);
    } catch {
      // ignore storage read errors
    }
  }, [id]);

  const saveNote = () => {
    if (!id) return;
    try {
      localStorage.setItem(`note_char_${id}`, note);
      // small UX confirmation; replace with toast if you have one
      alert("Saved locally");
    } catch {
      alert("Failed to save note (storage unavailable).");
    }
  };

  return (
    <Layout>
      <button onClick={() => router.back()} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="empty">
          <p>Error: {(error as Error)?.message ?? String(error)}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      ) : data ? (
        <div className="detail">
          <img
            src={(data as Character).image}
            alt={(data as Character).name}
            width={260}
            height={260}
            style={{ borderRadius: 8 }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ marginTop: 0 }}>{(data as Character).name}</h2>
            <div className="muted">
              {(data as Character).species} • {(data as Character).status} •{" "}
              {(data as Character).gender}
            </div>
            <p>Origin: {(data as Character).origin?.name}</p>
            <p>Location: {(data as Character).location?.name}</p>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => fav.toggle((data as Character).id)}>
                {fav.isFavorite((data as Character).id) ? "★ Unfavorite" : "☆ Favorite"}
              </button>
            </div>

            <div style={{ marginTop: 18 }}>
              <h4>Notes (local only)</h4>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={6}
                style={{ width: "100%" }}
              />
              <div style={{ marginTop: 8 }}>
                <button onClick={saveNote}>Save note</button>{" "}
                <button
                  onClick={() => {
                    if (!id) return;
                    try {
                      localStorage.removeItem(`note_char_${id}`);
                      setNote("");
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty">
          <p>Character not found.</p>
        </div>
      )}
    </Layout>
  );
}
