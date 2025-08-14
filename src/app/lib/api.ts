// lib/api.ts
export type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string; // often empty string
  gender: string;
  origin: { name: string; url?: string };
  location: { name: string; url?: string };
  image: string;
  episode: string[]; // array of episode URLs
  url: string;
  created: string;
};

export type CharactersResponse = {
  info: Info;
  results: Character[];
};

const BASE = "https://rickandmortyapi.com/api";

/**
 * Fetch characters with optional filters and AbortSignal support.
 * Returns the parsed JSON response typed as CharactersResponse.
 *
 * @param params - page, name, status, species, and optional AbortSignal
 */
export async function fetchCharacters(params: {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  signal?: AbortSignal;
} = {}): Promise<CharactersResponse> {
  const url = new URL(`${BASE}/character`);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.name) url.searchParams.set("name", params.name);
  if (params.status) url.searchParams.set("status", params.status);
  if (params.species) url.searchParams.set("species", params.species);

  const res = await fetch(url.toString(), { signal: params.signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${text}`);
  }

  // assert shape; caller can still validate further if needed
  const data = (await res.json()) as CharactersResponse;
  return data;
}

/**
 * Fetch a single character by id.
 *
 * @param id - character id or string id
 * @param signal - optional AbortSignal
 */
export async function fetchCharacterById(id: string | number, signal?: AbortSignal): Promise<Character> {
  if (id === null || id === undefined || id === "") throw new Error("Missing id");

  const res = await fetch(`${BASE}/character/${encodeURIComponent(String(id))}`, { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch character ${id}: ${res.status} ${text}`);
  }

  const data = (await res.json()) as Character;
  return data;
}
