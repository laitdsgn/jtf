import AutocompleteSystem from "@/components/AutocompleteSystem";

export const revalidate = 86400;
export default function Page() {
  const tries = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <main className="font-cascadia min-h-screen w-full flex flex-col items-center px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-3xl flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            ▶
          </div>
          <span className="text-blue-600 font-semibold tracking-tight">
            jakitofilm
          </span>
        </div>
        <span className="text-xs text-slate-400">v0.1 · tryb klasyczny</span>
      </header>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 text-center">
        Jaki to <span className="text-blue-500">film</span>?
      </h1>
      <p className="mt-2 text-slate-500 text-sm md:text-base text-center">
        zgadnij tytuł na podstawie klatki — masz 5 prób
      </p>

      {/* Frame */}
      <div className="mt-10 w-full max-w-3xl">
        <div className="rounded-xl border border-blue-200/70 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
          <div className="aspect-video w-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 text-sm">
            <span>klatka z filmu pojawi się tutaj</span>
          </div>
        </div>

        {/* Input */}
        <div className="">
          <AutocompleteSystem></AutocompleteSystem>
          <button
            type="button"
            className="h-11 px-5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:bg-blue-700 transition"
          >
            Zgadnij
          </button>
        </div>
      </div>

      {/* Tries */}
      <div className="mt-8 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-slate-500">
            próby
          </span>
          <span className="text-xs text-slate-400">0 / 5</span>
        </div>
        <ul className="flex flex-col gap-2">
          {tries.map((n) => (
            <li
              key={n}
              className="h-11 px-4 rounded-lg border border-dashed border-blue-200 bg-white/60 flex items-center justify-between text-sm text-slate-400"
            >
              <span className="font-mono text-xs text-slate-400">
                #{n.toString().padStart(2, "0")}
              </span>
              <span>—</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-10 text-xs text-slate-400">
        naciśnij <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500">Enter</kbd> aby zgadywać
      </footer>
    </main>
  );
}
