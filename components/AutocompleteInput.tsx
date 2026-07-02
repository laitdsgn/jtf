'use client';

import { useState } from "react";

interface Production {
    production_title: { en: string; pl: string };
    production_release: string;
}

const AutocompleteInput = ({ productions }: { productions: Production[] }) => {
    const [query, setQuery] = useState("");


    const filtered = query.length > 0
        ? productions.filter((p) =>
            p.production_title.pl.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleSelect = (title: string) => {
        setQuery(title);
    };

    return (
        <div className="flex flex-col items-center justify-center relative">
            <input
                className="bg-input rounded-sm w-full"
                type="text"
                name="prod"
                id="prod"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);

                }}
                autoComplete="off"
            />
            {filtered.length > 0 && (
                <ul className="absolute top-full w-full bg-popover border rounded-sm max-h-60 overflow-y-auto z-10">
                    {filtered.map((p, i) => (
                        <li
                            key={i}
                            className="px-3 py-2 cursor-pointer hover:bg-accent"
                            onClick={() => handleSelect(p.production_title.pl)}
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
