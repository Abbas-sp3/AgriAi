import { useGetWeather, getGetWeatherQueryKey } from "@workspace/api-client-react";
import { useLocation } from "@/hooks/use-location";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingLeaf } from "@/components/loading-leaf";
import { CloudSun, CloudRain, Wind, Droplets, MapPin, Leaf } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

export default function Weather() {
  const { t } = useLanguage();
  const { location, isLoading: locLoading } = useLocation();

  const { data: weather, isLoading: weatherLoading } = useGetWeather(
    { lat: location.lat, lon: location.lon },
    {
      query: {
        enabled: !!location.lat && !!location.lon,
        queryKey: getGetWeatherQueryKey({ lat: location.lat, lon: location.lon })
      },
    }
  );

  if (locLoading || weatherLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <LoadingLeaf className="scale-150 mb-4" />
        <p className="text-muted-foreground font-medium">{t("loading_weather")}</p>
      </div>
    );
  }

  if (!weather && !locLoading && !weatherLoading) {
    return (
      <div className="text-center p-12">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">{t("loc_required")}</h2>
        <p className="text-muted-foreground mt-2">{t("loc_required_sub")}</p>
      </div>
    );
  }

  const locationLabel = location.cityName
    || (weather?.location && !weather.location.match(/^\d/)) && weather.location
    || (location.lat ? `${location.lat.toFixed(2)}°N, ${location.lon?.toFixed(2)}°E` : "Current Location");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-secondary" />
          {t("farming_weather")}
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {locationLabel}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-secondary/10 to-background border-secondary/20 shadow-md">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm mb-1">{t("right_now")}</p>
                <div className="text-7xl font-bold text-foreground mb-2 tracking-tighter">
                  {weather?.temperature !== undefined ? Math.round(weather.temperature) : "--"}°<span className="text-4xl text-muted-foreground">C</span>
                </div>
                <p className="text-xl font-medium text-secondary-foreground capitalize">{weather?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("humidity")}</p>
                    <p className="text-lg font-semibold">{weather?.humidity !== undefined ? Math.round(weather.humidity) : "--"}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-500/10 rounded-full text-gray-500">
                    <Wind className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("wind")}</p>
                    <p className="text-lg font-semibold">{weather?.windspeed !== undefined ? Math.round(weather.windspeed) : "--"} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                    <CloudRain className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("precipitation")}</p>
                    <p className="text-lg font-semibold">{weather?.precipitation !== undefined ? Math.round(weather.precipitation) : 0} mm</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {weather?.farmingAdvice && (
          <Card className="bg-primary border-primary shadow-md text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5" />
                {t("agri_advice")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed font-medium">{weather.farmingAdvice}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">{t("forecast_7")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weather?.forecast?.map((day, i) => (
          <Card key={day.date} className={cn("text-center shadow-sm", i === 0 ? "border-secondary border-2" : "")}>
            <CardHeader className="py-4 pb-2 border-b bg-muted/30">
              <CardTitle className="text-sm font-medium">
                {i === 0 ? t("today") : format(parseISO(day.date), "EEE")}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{format(parseISO(day.date), "MMM d")}</p>
            </CardHeader>
            <CardContent className="py-4">
              <div className="mb-3">
                <CloudSun className="h-8 w-8 mx-auto text-secondary mb-1" />
                <p className="text-xs capitalize h-8 line-clamp-2 overflow-hidden leading-tight text-muted-foreground">
                  {day.description}
                </p>
              </div>
              <div className="flex justify-center items-center gap-2 text-sm font-medium">
                <span className="text-foreground">{Math.round(day.maxTemp)}°</span>
                <span className="text-muted-foreground">{Math.round(day.minTemp)}°</span>
              </div>
              {day.precipitation > 0 && (
                <div className="mt-2 text-xs text-blue-500 font-medium flex items-center justify-center gap-1">
                  <CloudRain className="h-3 w-3" /> {Math.round(day.precipitation)}mm
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
