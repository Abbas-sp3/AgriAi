import { useLocation } from "@/hooks/use-location";
import { useGetWeather, getGetWeatherQueryKey, useGetNews, getGetNewsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingLeaf } from "@/components/loading-leaf";
import { Leaf, CloudSun, Wind, Droplets, Sprout, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function Dashboard() {
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

  const { data: news, isLoading: newsLoading } = useGetNews(
    { category: "all" },
    { query: { enabled: true, queryKey: getGetNewsQueryKey({ category: "all" }) } }
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("welcome")}</h1>
        <p className="text-muted-foreground mt-1">{t("welcome_sub")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weather Overview */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CloudSun className="h-5 w-5 text-secondary" />
              {t("current_weather")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locLoading || weatherLoading ? (
              <LoadingLeaf />
            ) : weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold">{weather.temperature}°C</div>
                    <div className="text-muted-foreground capitalize">{weather.description}</div>
                  </div>
                  <CloudSun className="h-12 w-12 text-secondary/50" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>{weather.humidity}% {t("humidity")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>{weather.windspeed} km/h</span>
                  </div>
                </div>
                {weather.farmingAdvice && (
                  <div className="bg-primary/10 p-3 rounded-lg text-sm mt-4 border border-primary/20 text-primary-foreground">
                    <strong className="block text-primary mb-1">{t("farming_advice")}:</strong>
                    <span className="text-foreground">{weather.farmingAdvice}</span>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link href="/weather">{t("view_forecast")}</Link>
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">{t("weather_fail")}</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Tips */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                {t("quick_actions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild className="h-auto py-4 flex flex-col gap-2 items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground text-center">
                <Link href="/predict">
                  <Leaf className="h-6 w-6 mb-1" />
                  <span>{t("nav_predictor")}</span>
                  <span className="text-xs font-normal opacity-80">{t("ai_recs")}</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-auto py-4 flex flex-col gap-2 items-center justify-center text-center">
                <Link href="/advisor">
                  <CloudSun className="h-6 w-6 mb-1" />
                  <span>{t("ask_advisor")}</span>
                  <span className="text-xs font-normal opacity-80">{t("multilingual")}</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-accent-foreground" />
                {t("latest_news")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <LoadingLeaf />
              ) : news?.items ? (
                <div className="space-y-3">
                  {news.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-sm hover:text-primary transition-colors block">
                        {item.title}
                      </a>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>{item.source}</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="link" className="w-full text-xs p-0 h-auto mt-2">
                    <Link href="/news">{t("view_all_news")}</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">{t("no_news")}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
