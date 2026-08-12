import { useState } from "react";
import { useGetNews, getGetNewsQueryKey, GetNewsCategory } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingLeaf } from "@/components/loading-leaf";
import { ExternalLink, Newspaper, TrendingUp, Bug, Cloud, Landmark } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const CATEGORY_ICONS = {
  all:     Newspaper,
  schemes: Landmark,
  weather: Cloud,
  market:  TrendingUp,
  pest:    Bug,
};

export default function News() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<GetNewsCategory>(GetNewsCategory.all);

  const CATEGORIES = [
    { id: "all",     label: t("all_news"),      icon: CATEGORY_ICONS.all },
    { id: "schemes", label: t("govt_schemes"),   icon: CATEGORY_ICONS.schemes },
    { id: "weather", label: t("nav_weather"),    icon: CATEGORY_ICONS.weather },
    { id: "market",  label: t("market_prices"),  icon: CATEGORY_ICONS.market },
    { id: "pest",    label: t("pest_alerts"),     icon: CATEGORY_ICONS.pest },
  ];

  const { data, isLoading } = useGetNews(
    { category: activeCategory },
    { query: { enabled: true, queryKey: getGetNewsQueryKey({ category: activeCategory }) } }
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Newspaper className="h-8 w-8 text-accent-foreground" />
          {t("news_schemes")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("news_sub")}</p>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setActiveCategory(v as GetNewsCategory)} className="w-full">
        <TabsList className="w-full md:w-auto h-auto flex-wrap justify-start p-1 bg-muted/50">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-2 py-2">
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{cat.label}</span>
                <span className="md:hidden">{cat.label.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <LoadingLeaf className="scale-150" />
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((item) => (
                <Card key={item.id} className="flex flex-col h-full overflow-hidden hover:border-primary/50 transition-colors group">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <Badge variant={item.isScheme ? "default" : "secondary"} className={item.isScheme ? "bg-primary hover:bg-primary" : ""}>
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">{t("source_label")} {item.source}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <p className="text-sm text-foreground/80 line-clamp-4 leading-relaxed">
                      {item.summary}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1 w-full justify-center bg-primary/5 py-2 rounded-md"
                    >
                      {t("read_article")} <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-muted/30 rounded-xl border border-dashed">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">{t("no_news_found")}</h3>
              <p className="text-muted-foreground mt-1">{t("no_news_sub")}</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
