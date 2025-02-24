import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ArticleCard from "@/components/ArticleCard";
import fs from "fs/promises";
import path from "path";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Article = {
  title: string;
  description: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category: string;
};

// Function to fetch articles from JSON file
async function getArticles(): Promise<Article[]> {
  const filePath = path.join(process.cwd(), "data", "articles.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  return JSON.parse(jsonData);
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap md:flex-nowrap gap-6">
        {/* Main Content with Tabs */}
        <main className="flex-1 space-y-6">
          {/* Tabs Navigation */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex space-x-4 bg-white shadow-md p-2 rounded-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="cybersecurity">Cybersecurity</TabsTrigger>
            </TabsList>

            {/* All Articles */}
            <TabsContent value="all">
              {articles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))}
            </TabsContent>

            {/* AI Articles */}
            <TabsContent value="ai">
              {articles
                .filter((article) => article.category === "AI")
                .map((article, index) => (
                  <ArticleCard key={index} {...article} />
                ))}
            </TabsContent>

            {/* Tech Articles */}
            <TabsContent value="tech">
              {articles
                .filter((article) => article.category === "Tech")
                .map((article, index) => (
                  <ArticleCard key={index} {...article} />
                ))}
            </TabsContent>

            {/* Cybersecurity Articles */}
            <TabsContent value="cybersecurity">
              {articles
                .filter((article) => article.category === "Cybersecurity")
                .map((article, index) => (
                  <ArticleCard key={index} {...article} />
                ))}
            </TabsContent>
          </Tabs>
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
