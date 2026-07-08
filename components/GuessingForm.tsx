"use client"
import React, {useRef, useState} from 'react'
import {Button} from "@/components/ui/button";

export interface Production {
    id: string;
    production_title: { en: string; pl: string };
    production_release: string;
}



const GuessingForm = ({productions, winningProduction}: {productions: Production[], winningProduction: string }) => {
    const [selectedProd, setSelectedProd] = useState<{id:string | null, title:string, production_date:string}>({id: null, title: "", production_date: ""})
    const [query, setQuery] = useState<string>("")
    const [listStyle, setListStyle] = useState<string>("")
    const [error, setError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const filtered = query.length > 0
        ? productions.filter((p) =>
            p.production_title.pl.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleSelect = (id: string, title:string, productiond:string) => {
        setSelectedProd({id, title, production_date: productiond})
        setQuery(title + " (" + productiond.substring(0,4) + ")");
        setError(false);
    }

    const handleClick = () => {
        const isProductionOnList = productions.some(
            (p) => p.id === selectedProd.id
        );

        if (!isProductionOnList) {
            setError(true);
            inputRef.current?.focus();
        }
    }

    const inputBase =
        "w-full rounded-lg border border-blue-200/70 h-10 bg-white/80 backdrop-blur px-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-200/60";
    const inputError =
        "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200/70";

    return (
        <>
            <div className="relative w-full flex items-center justify-center h-fit my-5">
                <input
                    className={`${inputBase} ${error ? inputError : ""}`}
                    type="text"
                    name="prod"
                    ref={inputRef}
                    id="prod"
                    value={query}
                    placeholder="Wyszukaj produkcję…"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedProd({ id: null, title: "", production_date: "" });
                        setListStyle("")
                        setError(false);
                    }}
                    autoComplete="off"
                    aria-invalid={error}
                />
                {filtered.length > 0 && (
                    <ul className={`absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-blue-200/70 bg-white/95 shadow-md ${listStyle}` }>
                        {filtered.map((p) => (
                            <li
                                key={p.id}
                                className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-blue-50"
                                onClick={() => {
                                    handleSelect(p.id, p.production_title.pl, p.production_release)
                                    setListStyle("hidden")
                                }
                                }
                            >
                                {`${p.production_title.pl} (${p.production_release.substring(0,4)})`}
                            </li>
                        ))}
                    </ul>
                )}

           <Button onClick={handleClick} className={"h-10 mx-2 px-3"} size={null}>
                Zgadnij
           </Button>
            </div>
        </>
    )
}
export default GuessingForm
