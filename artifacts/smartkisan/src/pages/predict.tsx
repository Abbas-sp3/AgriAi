import { useState, useEffect } from "react";
import { usePredictCrop, useGetSoilByRegion, getGetSoilByRegionQueryKey, useGetWeather, getGetWeatherQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoadingLeaf } from "@/components/loading-leaf";
import { Leaf, Sprout, AlertCircle, RefreshCw, Sparkles, MapPin, TrendingUp } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  hasSoilAnalysis: z.boolean().default(false),
  region: z.string().optional(),
  N: z.coerce.number().min(0).max(300).default(0),
  P: z.coerce.number().min(0).max(300).default(0),
  K: z.coerce.number().min(0).max(300).default(0),
  ph: z.coerce.number().min(0).max(14).default(7),
  temperature: z.coerce.number().default(25),
  humidity: z.coerce.number().min(0).max(100).default(60),
  rainfall: z.coerce.number().min(0).default(100),
});

const REGIONS = [
  "Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Gujarat",
  "Karnataka", "Andhra Pradesh", "Tamil Nadu", "Kerala", "West Bengal",
  "Madhya Pradesh", "Bihar", "Rajasthan", "Odisha", "Telangana",
  "Assam", "Himachal Pradesh", "Jharkhand", "Chhattisgarh",
];

const PROFITABILITY_COLOR: Record<string, string> = {
  "Very High": "bg-emerald-500 text-white",
  "High":      "bg-green-500 text-white",
  "Medium":    "bg-yellow-500 text-white",
  "Low":       "bg-orange-400 text-white",
};

function getProfitabilityBadge(profitability: string) {
  const tier = Object.keys(PROFITABILITY_COLOR).find(k => profitability.startsWith(k)) || "Medium";
  return PROFITABILITY_COLOR[tier] || "bg-muted text-foreground";
}

export default function Predict() {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>("Maharashtra");

  const { location } = useLocation();
  const { data: weather } = useGetWeather(
    { lat: location.lat, lon: location.lon },
    { query: { enabled: !!location.lat && !!location.lon, queryKey: getGetWeatherQueryKey({ lat: location.lat, lon: location.lon }) } }
  );

  const { data: regionalSoil, isLoading: soilLoading } = useGetSoilByRegion(
    { region: selectedRegion },
    { query: { enabled: !!selectedRegion, queryKey: getGetSoilByRegionQueryKey({ region: selectedRegion }) } }
  );

  const predictMutation = usePredictCrop();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasSoilAnalysis: false,
      region: "Maharashtra",
      N: 0, P: 0, K: 0, ph: 7.0,
      temperature: 25, humidity: 60, rainfall: 100,
    },
  });

  const hasAnalysis = form.watch("hasSoilAnalysis");

  useEffect(() => {
    if (!hasAnalysis && regionalSoil) {
      form.setValue("N", regionalSoil.avgN);
      form.setValue("P", regionalSoil.avgP);
      form.setValue("K", regionalSoil.avgK);
      form.setValue("ph", regionalSoil.avgPh);
    }
  }, [hasAnalysis, regionalSoil, form]);

  useEffect(() => {
    if (weather) {
      form.setValue("temperature", weather.temperature);
      form.setValue("humidity", weather.humidity);
      if (weather.precipitation !== undefined) {
        form.setValue("rainfall", weather.precipitation * 30);
      }
    }
  }, [weather, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    predictMutation.mutate({
      data: {
        N: values.N, P: values.P, K: values.K,
        ph: values.ph, temperature: values.temperature,
        humidity: values.humidity, rainfall: values.rainfall,
        region: values.region,
      },
    });
  }

  const prediction = predictMutation.data;
  const exoticCrops = (prediction as any)?.exoticCrops as Array<{
    name: string; profitability: string; matchScore: number; suitableRegions: string[]; reason: string;
  }> | undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          {t("crop_predictor")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("crop_pred_sub")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── INPUT FORM ── */}
        <Card>
          <CardHeader>
            <CardTitle>{t("field_details")}</CardTitle>
            <CardDescription>{t("field_details_sub")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="hasSoilAnalysis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t("soil_done")}</FormLabel>
                        <FormDescription>{t("soil_done_hint")}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!hasAnalysis ? (
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("select_region")}</FormLabel>
                        <Select
                          onValueChange={(val) => { field.onChange(val); setSelectedRegion(val); }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("select_state")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {REGIONS.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {regionalSoil ? (
                            <span className="text-primary font-medium">
                              Loaded: N={regionalSoil.avgN} | P={regionalSoil.avgP} | K={regionalSoil.avgK} | pH={regionalSoil.avgPh} — {regionalSoil.soilType}
                            </span>
                          ) : (
                            `${t("using_avg")} ${field.value || "this region"}.`
                          )}
                        </FormDescription>
                        {soilLoading && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <RefreshCw className="h-3 w-3 animate-spin" /> {t("loading_region")}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="N" render={({ field }) => (
                      <FormItem><FormLabel>{t("nitrogen_label")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="P" render={({ field }) => (
                      <FormItem><FormLabel>{t("phosphorus_label")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="K" render={({ field }) => (
                      <FormItem><FormLabel>{t("potassium_label")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ph" render={({ field }) => (
                      <FormItem><FormLabel>{t("ph_label")}</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-3">{t("weather_section")}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="temperature" render={({ field }) => (
                      <FormItem><FormLabel>{t("temp_label")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="humidity" render={({ field }) => (
                      <FormItem><FormLabel>{t("humidity_label")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="rainfall" render={({ field }) => (
                      <FormItem><FormLabel>{t("rainfall_label")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={predictMutation.isPending}>
                  {predictMutation.isPending ? t("analyzing") : t("predict_btn")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* ── RESULTS ── */}
        <div className="space-y-4">
          {predictMutation.isPending && (
            <Card className="min-h-[300px] flex flex-col items-center justify-center border-dashed">
              <LoadingLeaf className="scale-150 mb-4" />
              <p className="text-lg font-medium text-primary">{t("analyzing_soil")}</p>
              <p className="text-sm text-muted-foreground mt-2 text-center px-6">
                {t("eval_soil")}
              </p>
            </Card>
          )}

          {prediction && !predictMutation.isPending && (
            <>
              <Card className="border-primary/50 shadow-md bg-gradient-to-b from-background to-primary/5">
                <CardHeader className="bg-primary/10 rounded-t-xl border-b border-primary/10 pb-6">
                  <CardDescription className="text-primary font-medium flex items-center gap-1 uppercase tracking-wider text-xs">
                    <Sprout className="h-3 w-3" /> {t("best_match")}
                  </CardDescription>
                  <CardTitle className="text-4xl text-primary mt-2">{prediction.crop}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex justify-between items-center bg-background rounded-lg p-4 border shadow-sm">
                    <div>
                      <div className="text-sm text-muted-foreground">{t("confidence")}</div>
                      <div className="text-xl font-bold">{Math.round(prediction.confidence * 100)}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{t("rec_season")}</div>
                      <div className="text-xl font-bold capitalize">{prediction.season}</div>
                    </div>
                  </div>

                  {prediction.estimatedYield && (
                    <div className="bg-secondary/10 text-secondary-foreground p-4 rounded-lg border border-secondary/20">
                      <strong className="block text-sm mb-1 opacity-80">{t("est_yield")}</strong>
                      <div className="font-semibold">{prediction.estimatedYield}</div>
                    </div>
                  )}

                  {prediction.alternativeCrops && prediction.alternativeCrops.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">{t("strong_alts")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {prediction.alternativeCrops.map(alt => (
                          <span key={alt} className="px-3 py-1 bg-muted rounded-full text-sm font-medium border">{alt}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {exoticCrops && exoticCrops.length > 0 && (
                <Card className="border-emerald-500/40 shadow-md bg-gradient-to-b from-background to-emerald-500/5">
                  <CardHeader className="bg-emerald-500/10 rounded-t-xl border-b border-emerald-500/10 pb-4">
                    <CardDescription className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 uppercase tracking-wider text-xs">
                      <Sparkles className="h-3 w-3" /> {t("exotic_opp")}
                    </CardDescription>
                    <CardTitle className="text-lg text-emerald-800 dark:text-emerald-300 mt-1">
                      {t("exotic_opp_sub")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {exoticCrops.map((crop) => (
                      <div key={crop.name} className="bg-background border border-emerald-500/20 rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-base text-emerald-800 dark:text-emerald-300">{crop.name}</h4>
                          <Badge className={`text-xs shrink-0 ${getProfitabilityBadge(crop.profitability)}`}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {crop.profitability.split("(")[0].trim()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{crop.profitability}</div>
                        <div className="text-sm text-foreground/80">{crop.reason}</div>
                        {crop.suitableRegions.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                            {crop.suitableRegions.map(r => (
                              <span key={r} className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">{r}</span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {t("match_score")}: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{Math.round(crop.matchScore * 100)}%</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1">
                      {t("open_calendar")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!predictMutation.isPending && !predictMutation.isSuccess && (
            <Card className="min-h-[300px] flex flex-col items-center justify-center bg-muted/30 border-dashed text-center p-8">
              <Leaf className="h-16 w-16 text-muted mb-4" />
              <h3 className="text-lg font-medium text-foreground">{t("awaiting_input")}</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">{t("awaiting_sub")}</p>
            </Card>
          )}

          {predictMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{t("pred_error")}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
