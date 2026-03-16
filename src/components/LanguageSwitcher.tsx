import { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "@/lib/translations";
import { useLang } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-background hover:border-border hover:bg-accent/50 transition-colors text-xs text-muted-foreground hover:text-foreground"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline font-medium">{current.code.toUpperCase()}</span>
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-36 bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors text-left ${
                lang === l.code
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              {l.label}
              {lang === l.code && <span className="ml-auto text-primary text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
