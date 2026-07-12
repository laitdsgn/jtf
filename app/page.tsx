import GuessingSystem from "../components/GuessingSystem";
import ProductionBox from "@/components/productionBox";

export const revalidate = 86400;


export default function Page() {


    return (
        <><p className={"text-end mx-3 my-2 text-stone-700/40"}>v0.0.1</p>
            <main className="font-cascadia min-h-screen w-full flex flex-col items-center px-6 py-10">


                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 text-center">
                    Jaki to <span className="text-blue-500">film</span>?
                </h1>
                <p className="mt-2 text-slate-500 text-sm md:text-base text-center">
                    zgadnij tytuł na podstawie klatki
                </p>

                {/* Frame */}
                <div className="mt-10 w-full max-w-3xl">
                    <div
                        className="rounded-xl border border-blue-200/70 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
                        <div
                            className="aspect-video w-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 text-sm">
                            <ProductionBox></ProductionBox>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="">
                        <GuessingSystem></GuessingSystem>

                    </div>
                </div>


                {/* Footer */}
                <footer className="mt-auto pt-10 text-xs text-slate-400">
                    naciśnij <kbd
                    className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500">Enter</kbd> aby
                    zgadywać


                </footer>
            </main>
        </>
    );
}
