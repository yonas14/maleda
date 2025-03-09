import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ArticleCard from "@/components/ArticleCard";
import fs from "fs/promises";
import path from "path";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

type Article = {
  title: string;
  description: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category: string;
  content: string;
  author: string;
  readTime: string;
};

// Function to fetch articles from JSON file
async function getArticles(): Promise<Article[]> {
  const filePath = path.join(process.cwd(), "data", "articles.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  return JSON.parse(jsonData);
}

export default async function Home() {
  const articles = await getArticles();
  
  // Get unique categories from articles, handling the typo in the property name
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  return (
    <div className="bg-gray min-h-screen">
      <Navbar />

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap gap-6">
        {/* Main Content with Tabs */}
        <main className="flex-1 border-r-2 border-gray-300" style={{ scrollBehavior: 'smooth' }}>
          <div className="px-4 py-6 space-y-6">
            {/* Tabs Navigation */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex space-x-4 bg-white shadow-md p-2 rounded-md sticky top-0 z-10">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category.toLowerCase()}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* All Articles */}
              <TabsContent value="all" className="space-y-6">
                {articles.map((article, index) => (
                  <Link key={index} href={`/article/${index}`} legacyBehavior>
                    <a>
                      <ArticleCard {...article} category={article.category} />
                    </a>
                  </Link>
                ))}
              </TabsContent>

              {/* Dynamic Category Tabs */}
              {categories.map((category) => (
                <TabsContent key={category} value={category.toLowerCase()} className="space-y-6">
                  {articles
                    .filter((article) => article.category === category)
                    .map((article, index) => (
                      <Link key={index} href={`/article/${index}`} legacyBehavior>
                        <a>
                          <ArticleCard {...article} category={article.category} />
                        </a>
                      </Link>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 py-6 flex justify-center">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
