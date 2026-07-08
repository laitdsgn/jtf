'use client';

import { useState } from "react";

export interface Production {
    id: string;
    production_title: { en: string; pl: string };
    production_release: string;
}

export interface AutocompleteInputProps {
    productions: Production[];
    onSelect?: (id: string, title: string) => void;
}

const AutocompleteInput = ({ productions, onSelect }: AutocompleteInputProps) => {
    const [query, setQuery] = useState("");


    const filtered = query.length > 0
        ? productions.filter((p) =>
            p.production_title.pl.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleSelect = (id: string, title: string) => {
        setQuery(title);

        onSelect?.(id, title);
    };

    return (
        <div className="relative w-full">
            <input
                className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                type="text"
                name="prod"
                id="prod"
                value={query}
                placeholder="Wyszukaj produkcję…"
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
            />
            {filtered.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-sm border border-zinc-800 bg-zinc-900 shadow-lg">
                    {filtered.map((p) => (
                        <li
                            key={p.id}
                            className="cursor-pointer px-3 py-2 text-sm text-zinc-100 hover:bg-emerald-950/40"
                            onClick={() => handleSelect(p.id, p.production_title.pl)}
                        >
                            {p.production_title.pl} ({p.production_release})
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default AutocompleteInput;
