import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import fs from "fs/promises";
import path from "path";
import MainTabs from "@/components/MainTabs";

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
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  return (
    <div className="bg-gray min-h-screen">
      <Navbar />

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap gap-6">
        {/* Main Content with Tabs */}
        <main className="flex-1 border-r-2 border-gray-300">
          <div className="px-4 py-6 space-y-6">
            <MainTabs articles={articles} categories={categories} />
          </div>
        </main>

        {/* Sidebar Container */}
        <div className="w-full md:w-1/4 relative">
          <div className="sticky top-6 py-6">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
