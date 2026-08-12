import { Link, useLocation } from "wouter";
import { Leaf, LayoutDashboard, Sprout, MessageSquare, CloudSun, Newspaper, Calendar, Languages, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthCheck } from "@workspace/api-client-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGE_META, type LangCode } from "@/lib/i18n";

const NAV_KEYS = [
  { href: "/",         key: "nav_dashboard" as const, icon: LayoutDashboard },
  { href: "/predict",  key: "nav_predictor"  as const, icon: Sprout },
  { href: "/advisor",  key: "nav_advisor"    as const, icon: MessageSquare },
  { href: "/weather",  key: "nav_weather"    as const, icon: CloudSun },
  { href: "/news",     key: "nav_news"       as const, icon: Newspaper },
  { href: "/calendar", key: "nav_calendar"   as const, icon: Calendar },
  { href: "/disease",  key: "nav_disease"    as const, icon: Microscope },
];

function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <Select value={lang} onValueChange={(v) => setLang(v as LangCode)}>
      <SelectTrigger className={cn("gap-1 bg-background border-muted", compact ? "h-8 text-xs w-32" : "h-9 text-sm w-full")}>
        <Languages className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(LANGUAGE_META) as [LangCode, typeof LANGUAGE_META[LangCode]][]).map(([code, meta]) => (
          <SelectItem key={code} value={code}>
            <span className="font-medium">{meta.nativeName}</span>
            <span className="text-muted-foreground text-xs ml-1">· {meta.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck();
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar – desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border relative">
        <div className="p-6 flex items-center gap-3">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-sidebar-foreground tracking-tight">SmartKisan AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_KEYS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-sm font-medium",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Language selector in sidebar */}
        <div className="px-4 pb-3">
          <LanguageSelector />
        </div>

        {health && (
          <div className="pb-4 px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t("api_online")}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>API Status: {health.status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-3 bg-background border-b z-10">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SmartKisan AI</span>
          </div>
          <LanguageSelector compact />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center justify-around p-2 bg-background border-t pb-safe">
          {NAV_KEYS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg min-w-[4rem]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium leading-none">{t(item.key).split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
