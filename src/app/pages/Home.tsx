// src/app/pages/Home.tsx
"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, type QueryFunctionContext, type InfiniteData } from "@tanstack/react-query";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import CharacterCard from "../components/CharacterCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

import { fetchCharacters, type CharactersResponse, type Character } from "../lib/api";
import { useDebounce } from "../hooks/useDebounce";
import { useFavorites } from "../hooks/useFavorites";

export default function Home(): JSX.Element {
  const searchParams = useSearchParams();

  // read initial values from URL
  const qParam = searchParams?.get("q") ?? "";
  const statusParam = searchParams?.get("status") ?? "";
  const speciesParam = searchParams?.get("species") ?? "";
  const sortParam = searchParams?.get("sort") ?? "name_asc";
  const favoritesParam = searchParams?.get("favorites") === "1";

  // local controlled inputs
  const [qLocal, setQLocal] = useState<string>(qParam);
  const [status, setStatus] = useState<string>(statusParam);
  const [species, setSpecies] = useState<string>(speciesParam);
  const [sort, setSort] = useState<string>(sortParam);
  const [showFavorites, setShowFavorites] = useState<boolean>(favoritesParam);

  const debouncedQ = useDebounce(qLocal, 350);

  // sync controls -> URL using replaceState (keeps URL shareable)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (debouncedQ) url.searchParams.set("q", debouncedQ);
    else url.searchParams.delete("q");

    if (status) url.searchParams.set("status", status);
    else url.searchParams.delete("status");

    if (species) url.searchParams.set("species", species);
    else url.searchParams.delete("species");

    if (sort) url.searchParams.set("sort", sort);
    else url.searchParams.delete("sort");

    if (showFavorites) url.searchParams.set("favorites", "1");
    else url.searchParams.delete("favorites");

    window.history.replaceState({}, "", url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, status, species, sort, showFavorites]);

  const fav = useFavorites();

  // --- useInfiniteQuery (typed) ---
  // QueryFn returns CharactersResponse for each page.
  // We declare the infinite-data type explicitly so `data.pages` is available.
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<
    CharactersResponse, // TQueryFnData (each page)
    Error,              // TError
    InfiniteData<CharactersResponse, number>, // TData (infinite data wrapper)
    readonly unknown[], // TQueryKey
    number              // TPageParam
  >({
    queryKey: ["characters", debouncedQ, status, species],
    queryFn: async (context: QueryFunctionContext<readonly unknown[], number>) => {
      const pageParam = (context.pageParam ?? 1) as number;
      const signal = context.signal;
      const res = await fetchCharacters({
        page: pageParam,
        name: debouncedQ || undefined,
        status: status || undefined,
        species: species || undefined,
        signal,
      });
      return res; // CharactersResponse
    },
    // initial page param (keeps typings happy and is sensible here)
    initialPageParam: 1,
    getNextPageParam: (last: CharactersResponse) => {
      const next = last?.info?.next;
      if (!next) return undefined;
      try {
        return Number(new URL(next).searchParams.get("page") ?? undefined);
      } catch {
        return undefined;
      }
    },
    staleTime: 1000 * 30,
  });

  // aggregate items from typed pages
  const items: Character[] = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p: CharactersResponse) => p.results ?? []);
  }, [data]);

  // favorites filter + client-side sort
  const filteredItems = useMemo(() => {
    let list = [...(items ?? [])];
    if (showFavorites) {
      const ids = Object.keys(fav.favorites).map((s) => Number(s));
      list = list.filter((it) => ids.includes(it.id));
    }
    if (sort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name_desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "id_asc") list.sort((a, b) => a.id - b.id);
    else if (sort === "id_desc") list.sort((a, b) => b.id - a.id);
    return list;
  }, [items, fav.favorites, showFavorites, sort]);

  return (
    <Layout>
      <div className="controls" style={{ marginBottom: 12 }}>
        <SearchBar value={qLocal} onChange={setQLocal} />
        <Filters
          status={status}
          setStatus={setStatus}
          species={species}
          setSpecies={setSpecies}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {isLoading ? (
        <>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </>
      ) : isError ? (
        <div className="empty">
          <p>Failed to load: {(error as Error)?.message ?? String(error)}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      ) : (
        <>
          {filteredItems.length === 0 ? (
            <div className="empty">
              <h3>No results</h3>
              <p>Try a different search or clear filters.</p>
            </div>
          ) : (
            <div className="list">
              {filteredItems.map((c) => (
                <CharacterCard
                  key={c.id}
                  character={c}
                  isFavorite={fav.isFavorite(c.id)}
                  onToggleFavorite={() => fav.toggle(c.id)}
                />
              ))}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            {hasNextPage ? (
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            ) : (
              <div className="muted">No more results.</div>
            )}
            {isFetching && !isFetchingNextPage ? <div className="muted">Background updating...</div> : null}
          </div>
        </>
      )}
    </Layout>
  );
}
