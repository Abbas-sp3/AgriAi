import { useState } from "react";
import { useGetCropCalendar, getGetCropCalendarQueryKey, useGetCropDetails } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Leaf, Calendar, Droplets, Sparkles, TrendingUp, MapPin, Bug, FlaskConical, BookOpen } from "lucide-react";
import { LoadingLeaf } from "@/components/loading-leaf";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { GetCropCalendarResponse } from "@workspace/api-zod";
import { useLanguage } from "@/hooks/use-language";

type CalendarEntry =
  z.infer<typeof GetCropCalendarResponse>["entries"][number] & {
    isExotic?: boolean;
    profitability?: string;
    regions?: string[];
  };

const SEASON_BADGE: Record<string, string> = {
  kharif: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200",
  rabi:   "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200",
  zaid:   "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200",
  exotic: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200",
};

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CURRENT_MONTH = new Date().toLocaleString("en-US", { month: "long" });

function MonthBar({ months, color }: { months: string[]; color: string }) {
  return (
    <div className="flex gap-0.5">
      {MONTHS_SHORT.map((m) => {
        const active = months.some((month) => month.substring(0, 3) === m);
        const isCurrent = CURRENT_MONTH.substring(0, 3) === m;
        return (
          <div
            key={m}
            title={active ? m : ""}
            className={`
              h-2.5 flex-1 rounded-sm transition-all
              ${active ? color : "bg-muted/40"}
              ${isCurrent ? "ring-2 ring-offset-1 ring-primary/60" : ""}
            `}
          />
        );
      })}
    </div>
  );
}

function CropCard({ entry, onClick, t }: { entry: CalendarEntry; onClick: () => void; t: (k: any) => string }) {
  const seasonKey = entry.isExotic ? "exotic" : entry.season;
  const seasonColor = SEASON_BADGE[seasonKey] || SEASON_BADGE["kharif"];

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border ${entry.isExotic ? "border-emerald-400/50 bg-gradient-to-b from-background to-emerald-500/5" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={`text-base font-bold ${entry.isExotic ? "text-emerald-800 dark:text-emerald-300" : ""}`}>
            {entry.isExotic && <Sparkles className="inline h-4 w-4 mr-1 text-emerald-500" />}
            {entry.crop}
          </CardTitle>
          <Badge className={`text-xs capitalize shrink-0 border ${seasonColor}`} variant="outline">
            {entry.isExotic ? t("exotic_badge") : entry.season}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1"><Leaf className="h-3 w-3 text-green-500" /> {t("sowing")}</span>
            <span>{entry.sowingMonths.join(", ")}</span>
          </div>
          <MonthBar months={entry.sowingMonths} color="bg-green-400 dark:bg-green-600" />
          <div className="flex justify-between text-xs text-muted-foreground mb-1 mt-2">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-amber-500" /> {t("harvest")}</span>
            <span>{entry.harvestMonths.join(", ")}</span>
          </div>
          <MonthBar months={entry.harvestMonths} color="bg-amber-400 dark:bg-amber-600" />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Droplets className="h-3 w-3 text-sky-400" />
          <span>{entry.waterRequirement}</span>
        </div>

        {entry.isExotic && entry.profitability && (
          <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3 w-3" />
            {entry.profitability}
          </div>
        )}

        {entry.isExotic && entry.regions && entry.regions.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            {entry.regions.slice(0, 3).map((r: string) => (
              <span key={r} className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">{r}</span>
            ))}
            {entry.regions.length > 3 && (
              <span className="text-xs text-muted-foreground">+{entry.regions.length - 3}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CalendarPage() {
  const { t } = useLanguage();
  const [activeSeason, setActiveSeason] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState<CalendarEntry | null>(null);

  const SEASONS = [
    { value: "all",    label: t("all_crops") },
    { value: "kharif", label: "Kharif" },
    { value: "rabi",   label: "Rabi" },
    { value: "zaid",   label: "Zaid" },
    { value: "exotic", label: `✨ ${t("exotic_badge")}` },
  ];

  const { data, isLoading } = useGetCropCalendar(
    { region: "India" },
    { query: { queryKey: getGetCropCalendarQueryKey({ region: "India" }) } }
  );

  const { data: cropDetails, isLoading: detailsLoading } = useGetCropDetails(
    { crop: selectedCrop?.crop ?? "" },
    { query: { enabled: !!selectedCrop?.crop, queryKey: ["cropDetails", selectedCrop?.crop ?? ""] } }
  );

  const entries = ((data?.entries ?? []) as CalendarEntry[]).filter((e) => {
    if (activeSeason === "exotic") return e.isExotic === true;
    if (activeSeason === "all") return true;
    return e.season === activeSeason;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          {t("crop_calendar")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("cal_sub")}</p>
      </div>

      {data?.currentMonth && (
        <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {t("current_month")}: <strong>{data.currentMonth}</strong> — {t("highlighted")}
        </div>
      )}

      <Tabs value={activeSeason} onValueChange={setActiveSeason} className="space-y-4">
        <TabsList className="flex w-full h-auto gap-1 bg-muted/50 p-1">
          {SEASONS.map((s) => (
            <TabsTrigger key={s.value} value={s.value} className="flex-1 text-sm">
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SEASONS.map((s) => (
          <TabsContent key={s.value} value={s.value} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <LoadingLeaf className="scale-150" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>{t("no_crops")}</p>
              </div>
            ) : (
              <>
                {s.value === "exotic" && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4 text-sm text-emerald-800 dark:text-emerald-200">
                    <strong className="flex items-center gap-1 mb-1">
                      <Sparkles className="h-4 w-4" /> {t("premium_exotic")}
                    </strong>
                    {t("premium_exotic_sub")}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entries.map((entry) => (
                    <CropCard key={entry.crop} entry={entry} onClick={() => setSelectedCrop(entry)} t={t} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Crop Detail Modal ── */}
      <Dialog open={!!selectedCrop} onOpenChange={(open) => !open && setSelectedCrop(null)}>
        <DialogContent className="max-w-2xl h-[88vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedCrop?.isExotic && <Sparkles className="h-5 w-5 text-emerald-500" />}
              {selectedCrop?.crop}
              {selectedCrop && (
                <Badge variant="outline" className={`ml-2 text-xs capitalize ${SEASON_BADGE[selectedCrop.isExotic ? "exotic" : selectedCrop.season] || ""}`}>
                  {selectedCrop.isExotic ? t("exotic_badge") : selectedCrop.season}
                </Badge>
              )}
            </DialogTitle>
            {selectedCrop?.isExotic && selectedCrop.profitability && (
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                {selectedCrop.profitability}
              </p>
            )}
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="px-6 py-5 space-y-6">
              {detailsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <LoadingLeaf className="scale-150" />
                </div>
              ) : cropDetails ? (
                <>
                  <section>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cropDetails.description}</p>
                  </section>

                  <section className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                      <div className="font-medium text-xs uppercase text-muted-foreground">{t("season_label")}</div>
                      <div className="font-semibold">{cropDetails.season}</div>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                      <div className="font-medium text-xs uppercase text-muted-foreground">{t("duration_label")}</div>
                      <div className="font-semibold">{cropDetails.duration}</div>
                    </div>
                    {cropDetails.soilRequirement && (
                      <div className="bg-muted/40 rounded-lg p-3 space-y-1 col-span-2">
                        <div className="font-medium text-xs uppercase text-muted-foreground">{t("soil_req")}</div>
                        <div className="font-semibold">{cropDetails.soilRequirement}</div>
                      </div>
                    )}
                    {cropDetails.waterRequirement && (
                      <div className="bg-muted/40 rounded-lg p-3 space-y-1 col-span-2">
                        <div className="font-medium text-xs uppercase text-muted-foreground">{t("water_req")}</div>
                        <div className="font-semibold">{cropDetails.waterRequirement}</div>
                      </div>
                    )}
                  </section>

                  {(cropDetails.marketPrice || cropDetails.yieldPerAcre) && (
                    <section className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-300">
                        <TrendingUp className="h-4 w-4" /> {t("market_yield")}
                      </h4>
                      {cropDetails.marketPrice && <p className="text-sm"><strong>{t("price_label")}:</strong> {cropDetails.marketPrice}</p>}
                      {cropDetails.yieldPerAcre && <p className="text-sm"><strong>{t("yield_label")}:</strong> {cropDetails.yieldPerAcre}</p>}
                    </section>
                  )}

                  {cropDetails.fertilizers && cropDetails.fertilizers.length > 0 && (
                    <section>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <FlaskConical className="h-4 w-4 text-primary" /> {t("fertilizer_sched")}
                      </h4>
                      <ul className="space-y-2">
                        {cropDetails.fertilizers.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {cropDetails.diseases && cropDetails.diseases.length > 0 && (
                    <section>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <Bug className="h-4 w-4 text-destructive" /> {t("diseases")}
                      </h4>
                      <div className="space-y-3">
                        {cropDetails.diseases.map((d, i) => (
                          <div key={i} className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 text-sm space-y-1">
                            <div className="font-semibold text-destructive">{d.name}</div>
                            <div><span className="text-muted-foreground">{t("symptoms")}:</span> {d.symptoms}</div>
                            <div><span className="text-muted-foreground">{t("treatment")}:</span> {d.treatment}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {cropDetails.govtSchemes && cropDetails.govtSchemes.length > 0 && (
                    <section>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <BookOpen className="h-4 w-4 text-blue-500" /> {t("govt_schemes_cal")}
                      </h4>
                      <ul className="space-y-2">
                        {cropDetails.govtSchemes.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm bg-blue-500/5 border border-blue-500/20 rounded p-2">
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {cropDetails.localNames && Object.keys(cropDetails.localNames).length > 0 && (
                    <section className="pb-4">
                      <h4 className="font-semibold mb-3 text-foreground">{t("local_names")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(cropDetails.localNames).map(([lang, name]) => (
                          <span key={lang} className="text-xs bg-muted border rounded-full px-3 py-1">
                            <span className="text-muted-foreground mr-1 uppercase">{lang}:</span>
                            <span className="font-medium">{name}</span>
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Leaf className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>{t("no_details")}</p>
                  {selectedCrop && (
                    <div className="mt-4 space-y-2 text-sm text-left max-w-sm mx-auto">
                      <div className="bg-muted/40 rounded p-3"><strong>{t("season_label")}:</strong> {selectedCrop.season}</div>
                      <div className="bg-muted/40 rounded p-3"><strong>{t("sowing")}:</strong> {selectedCrop.sowingMonths.join(", ")}</div>
                      <div className="bg-muted/40 rounded p-3"><strong>{t("harvest")}:</strong> {selectedCrop.harvestMonths.join(", ")}</div>
                      {selectedCrop.waterRequirement && (
                        <div className="bg-muted/40 rounded p-3"><strong>{t("water_req")}:</strong> {selectedCrop.waterRequirement}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
