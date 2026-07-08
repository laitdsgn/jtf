"use client"
import React, {useState} from 'react'

export interface Production {
    id: string;
    production_title: { en: string; pl: string };
    production_release: string;
}



const GuessingForm = ({productions, winningProduction}: {productions: Production[], winningProduction: string }) => {
    const [selectedProd, setSelectedProd] = useState<{id:string, title:string}>({id: "", title: ""})
    const [query, setQuery] = useState<string>("")

    const filtered = query.length > 0
        ? productions.filter((p) =>
            p.production_title.pl.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleSelect = (id: string, title:string) => {
        setSelectedProd({id, title})
        setQuery(title);
    }

    const handleClick = () => {
        const isProductionOnList = productions.some(
            (p) => p.id === selectedProd.id
        );


        if (!isProductionOnList) {
            alert("Nie ma produkcji")
        }
    }

    return (
        <>
            <div className="relative w-full flex">
                <input
                    className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    type="text"
                    name="prod"
                    id="prod"
                    value={query}
                    placeholder="Wyszukaj produkcję…"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedProd({ id: "", title: "" });
                    }}
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

            <button
                type="button"
                className="h-11 px-5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:bg-blue-700 transition"
                onClick={handleClick}
            >
                Zgadnij
            </button>
            </div>
        </>
    )
}
export default GuessingForm
