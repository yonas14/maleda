import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import articles from "../../data/articles.json";

type Article = {
  title: string;
  views: string;
  comments: string;
};

type TrendingArticle = {
  id: number;
  title: string;
  views: string;
  score: number;
};

export default function Sidebar() {
  // Calculate trending articles based on views and comments
  const trendingArticles: TrendingArticle[] = articles
    .map((article: Article, index: number) => {
      // Convert view count (e.g., "38K" or "15.2K") to number
      const viewCount = parseFloat(article.views.replace(/[^\d.]/g, '')) * 
        (article.views.includes('K') ? 1000 : 1);
      
      // Convert comment count to number
      const commentCount = parseInt(article.comments.replace(/[^\d]/g, ''));
      
      // Calculate ranking score (views + comments * 10)
      const score = viewCount + (commentCount * 10);
      
      return {
        id: index,
        title: article.title,
        views: article.views,
        score
      };
    })
    .sort((a: TrendingArticle, b: TrendingArticle) => b.score - a.score) // Sort by score descending
    .slice(0, 3); // Get top 3

  return (
    <aside className="space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search articles..." className="pl-8" />
          </div>
        </CardContent>
      </Card>

      {/* Trending Articles */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Trending Now</h3>
          <ul className="space-y-4">
            {trendingArticles.map((article, index) => (
              <li key={article.id} className="group">
                <Link href={`/article/${article.id}`} className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-800">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-black">{article.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{article.views} views</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            {["AI", "Tech", "Web Development", "Cybersecurity", "Writing", "Self Improvement"].map(
              (topic) => (
                <Link key={topic} href={`/topic/${topic.toLowerCase().replace(' ', '-')}`}>
                  <Button variant="outline" size="sm" className="rounded-full">
                    {topic}
                  </Button>
                </Link>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
          <p className="text-sm text-gray-600 mb-4">Get the latest articles and insights in your inbox.</p>
          <Input placeholder="Enter your email" className="mb-2" />
          <Button className="w-full">Subscribe</Button>
        </CardContent>
      </Card>
    </aside>
  );
}
