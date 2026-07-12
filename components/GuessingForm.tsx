"use client"
import React, {useRef, useState} from 'react'
import {Button} from "@/components/ui/button";

export interface Production {
    id: string;
    production_title: { en: string; pl: string };
    production_release: string;
}

type selectedProductionTypePrimitive = {
    id: string | null,
    title: string,
    production_date?: string
};

type winningProductionType = {
    production_type: "film" | "serial",
    production_title: { "en": string, "pl": string },
    production_release: string,
}

const GuessingForm = ({productions, winningProductionID, winningProductionData}: {
    productions: Production[],
    winningProductionID: string,
    winningProductionData: winningProductionType
}) => {
    const [selectedProd, setSelectedProd] = useState<selectedProductionTypePrimitive>({
        id: null,
        title: "",

    })
    const [tryIndex, setTryIndex] = useState<number>(0);
    const [query, setQuery] = useState<string>("")
    const [productionTries, setProductionTries] = useState<string[][]>([["", ""], ["", ""], ["", ""], ["", ""], ["", ""],]);
    const [listStyle, setListStyle] = useState<string>("")
    const [error, setError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const filtered = query.length > 0
        ? productions.filter((p) =>
            p.production_title.pl.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleSelect = (id: string, title: string, productiond: string) => {
        setSelectedProd({id, title, production_date: productiond})
        setQuery(title + " (" + productiond.substring(0, 4) + ")");
        setError(false);
    }

    const handleClick = () => {
        const isProductionOnList = productions.some(
            (p) => p.id === selectedProd.id
        );

        if (!isProductionOnList) {
            setError(true);
            inputRef.current?.focus();
            return;
        } else {
            try {

                if (tryIndex < 5) {

                    if (productionTries.some((item) => item[1] === selectedProd.id)) {
                        setError(true);
                    } else {
                        setProductionTries((prevTries) => {
                            const fillTries = [...prevTries];
                            fillTries[tryIndex][0] = selectedProd.title;
                            fillTries[tryIndex][1] = selectedProd.id!;
                            return fillTries;

                        });

                        setTryIndex((prevIndex) => prevIndex + 1);
                    }


                }

            } catch (e) {
                console.error(e)
            }

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
                        setSelectedProd({id: null, title: "", production_date: ""});
                        setListStyle("")
                        setError(false);
                    }}
                    autoComplete="off"
                    aria-invalid={error}
                />
                {filtered.length > 0 && (
                    <ul className={`absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-blue-200/70 bg-white/95 shadow-md ${listStyle}`}>
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
                                {`${p.production_title.pl} (${p.production_release.substring(0, 4)})`}
                            </li>
                        ))}
                    </ul>
                )}

                <Button onClick={handleClick} className={"h-10 mx-2 px-3"} size={null}>
                    Zgadnij
                </Button>
            </div>


            {/* Tries */}
            <div className="mt-8 w-full max-w-3xl">
                <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-slate-500">
            próby
          </span>
                    <span className="text-xs text-slate-400">{tryIndex} / 5</span>
                </div>
                <ul className="flex flex-col gap-2">
                    {

                        productionTries.map((n, index) => {

                            let itemStyles = "border-dashed border-slate-200 bg-white/40 text-slate-400";

                            if (index === tryIndex) {

                                itemStyles = "border-solid border-stone-500 bg-black/5 text-slate-800 ring-1 ring-stone-500";
                            } else if (n[1] !== "") {

                                if (n[1] === winningProductionID) {
                                    itemStyles = "border-solid border-emerald-500 bg-emerald-50 text-emerald-700 font-medium";
                                } else {
                                    itemStyles = "border-solid border-red-400 bg-red-50 text-red-700";
                                }
                            }

                            return (
                                <li
                                    key={index}
                                    className={`h-11 px-4 rounded-lg border border-dashed flex  items-center justify-between text-sm  ${itemStyles} `}
                                >
                                  <span className="font-mono text-xs text-slate-400">
                                    #{(index + 1).toString().padStart(2, "0")}
                                  </span>
                                    <span>{n[0] == "" ? "-" : n[0]}</span>

                                </li>
                            );
                        })

                    }
                </ul>
            </div>

            {/*<div*/}
            {/*    className={"z-100 absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black/20 backdrop-blur-xl"}>*/}
            {/*    <div*/}
            {/*        className={"w-[50vw] h-[70vh] rounded-md bg-white flex flex-col justify-center items-center"}>*/}
            {/*        <h2>wygrales*/}
            {/*            / przegrales</h2>*/}
            {/*        <p className={"text-black text-sm mt-4"}>Poprawny*/}
            {/*            film {winningProductionData.production_title.pl} (ang. {winningProductionData.production_title.en})</p>*/}
            {/*        <p>typ: {winningProductionData.production_type}</p>*/}
            {/*        <p>Data wydania {winningProductionData.production_release}</p>*/}
            {/*    </div>*/}

            {/*</div>*/}
        </>
    )
}
export default GuessingForm
